import { rgb } from 'wheels/esm/color/srgb'
import { max, floor } from 'wheels/esm/math'
import { range } from 'wheels/esm/fp'
import { overwrite } from 'wheels/esm/object'
import { element, context2d } from 'wheels/esm/dom'
import { Renderer, Renderable } from './Renderer'
import { ASCIICoreSettings } from './ASCIICoreSettings'
import { ASCIISettings } from './ASCIISettings'
import { downscale } from '../downscale'

export class ASCII {
  regl: any
  luts!: Float32Array[]
  renderer: Renderer
  settings = new ASCIISettings
  charMap = Uint8Array.from(range(0x20, 0x7f)) // from " " to "~"

  constructor(REGL: any, settings?: Partial<ASCIICoreSettings>) {
    const canvas = element('canvas')()
    const extensions = [ 'OES_texture_float' ]
    this.regl = REGL({ canvas, extensions })
    this.renderer = new Renderer(this)
    this.update(settings)
  }

  private makeGlyph(charCode: number) {
    const { fontFace, fontBlur, fontWidth, fontHeight, fontWidthPadded, fontHeightPadded } = this.settings
    const glyph = context2d({ width: fontWidthPadded, height: fontHeightPadded })
    const char = String.fromCharCode(charCode)

    glyph.fillStyle = '#00f'
    glyph.fillRect(0, 0, fontWidthPadded, fontHeightPadded)

    glyph.fillStyle = '#000'
    glyph.translate(fontWidthPadded/2, fontHeightPadded/2)
    glyph.fillRect(-fontWidth/2, -fontHeight/2, fontWidth, fontHeight)

    glyph.fillStyle = '#fff'
    glyph.textAlign = 'center'
    glyph.font = `${fontHeight}px ${fontFace}`
    glyph.translate(0, fontHeight/4)

    for (let i = 0; i < fontBlur;) {
      glyph.filter = `blur(${1<<i}px)`
      glyph.globalAlpha = ++i/fontBlur
      glyph.fillText(char, 0, 0)
    }

    return glyph
  }

  private makeLut(charCode: number) {
    const { lutWidth, lutHeight, lutPadding, lutWidthPadded, lutHeightPadded } = this.settings
    const scaled = downscale(this.makeGlyph(charCode), lutWidthPadded, lutHeightPadded)
    const bytes = scaled.getImageData(lutPadding, lutPadding, lutWidth, lutHeight).data
    const floats = new Float32Array(bytes.length >> 2)

    for (let i = 0; i < floats.length; i++)
      floats[i] = bytes[i << 2] / 0xff

    return floats
  }

  private makeLuts() {
    const luts = Array.from(this.charMap, cc => this.makeLut(cc))
    const brightest = luts.reduce((m, lut) => max(m, ...lut), 0)

    for (const lut of luts)
      for (let i = 0; i < lut.length; i++)
        lut[i] = rgb(lut[i] / brightest)

    return luts
  }

  private *map(bytes: Uint8Array, width: number, height: number) {
    const { charMap } = this

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++)
        yield charMap[bytes[x + y*width << 2]]
      yield 0xa
    }
  }

  update(settings?: Partial<ASCIICoreSettings>) {
    overwrite(this.settings, settings!)
    this.luts = this.makeLuts()
    this.renderer.update()
  }

  render(renderable: Renderable, width: number, height: number) {
    const widthʹ = floor(width), heightʹ = floor(height)
    const bytes = this.renderer.render(renderable, widthʹ, heightʹ)
    const chars = String.fromCharCode(...this.map(bytes, widthʹ, heightʹ))
    return chars
  }
}
