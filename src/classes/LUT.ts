import { context2d } from 'wheels/esm/dom'
import { abs, round } from 'wheels/esm/math'
import { rgb } from 'wheels/esm/color/srgb'
import { str } from '../utils'
import { downscale } from '../downscale'
import { Settings } from './Settings'

const enum Color {
  outline    = '#00f',
  background = '#000',
  foreground = '#fff'
}

export class LUT extends Float32Array {
  static fromCharCode(charCode: number, settings: Settings) {
    const { fontWidth, fontHeight, fontFace, fontBlur, fontGamma } = settings
    const { lutWidth, lutHeight, lutPadding } = settings

    const lutWidthʹ   = lutPadding*2 + lutWidth
    const lutHeightʹ  = lutPadding*2 + lutHeight

    const fontWidthʹ  = round(lutWidthʹ  / lutWidth  * fontWidth)
    const fontHeightʹ = round(lutHeightʹ / lutHeight * fontHeight)

    const api = context2d({ width: fontWidthʹ, height: fontHeightʹ })()
    const char = str(charCode)

    api.fillStyle = Color.outline
    api.fillRect(0, 0, fontWidthʹ, fontHeightʹ)

    api.translate(fontWidthʹ/2, fontHeightʹ/2)
    api.fillStyle = Color.background
    api.fillRect(-fontWidth/2, -fontHeight/2, fontWidth, fontHeight)

    api.translate(0, fontHeight/4)
    api.fillStyle = Color.foreground
    api.textAlign = 'center'
    api.font = `${fontHeight}px ${fontFace}`

    for (let i = 0; i < fontBlur;) {
      api.filter = `blur(${1 << i}px)`
      api.globalAlpha = (++i / fontBlur)**fontGamma
      api.fillText(char, 0, 0)
    }

    const scaled = downscale(api, lutWidthʹ, lutHeightʹ)
    const rgba = scaled.getImageData(lutPadding, lutPadding, lutWidth, lutHeight).data
    const lut = new LUT(lutWidth, lutHeight)

    for (let i = 0; i < lut.length; i++)
      lut[i] = rgb(rgba[i << 2] / 0xff)

    return lut
  }

  static combine(...luts: LUT[]) {
    const width = luts[0].length
    const height = luts.length
    const lut = new LUT(width, height)

    for (let i = 0; i < height; i++)
      lut.set(luts[i], i*width)

    return lut
  }

  constructor(public width: number, public height: number) {
    super(width * height)
  }

  normalize(min: number, max: number) {
    for (let i = 0; i < this.length; i++)
      this[i] = (this[i] - min) / (max - min)
  }

  compare(other: ArrayLike<number>) {
    let acc = 0

    for (let i = this.length; i--;)
      acc += abs(this[i] - other[i])

    return acc
  }
}
