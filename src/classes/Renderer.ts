import { context2d } from 'wheels/esm/dom'
import { floor, max } from 'wheels/esm/math'
import { overwrite } from 'wheels/esm/object'
import { Source } from '../canvas'
import { chr, monospaced } from '../utils'
import { LUT, fromCharCode } from './LUT'
import { Settings } from './Settings'

export abstract class Renderer {
  protected readonly api: CanvasRenderingContext2D
  protected readonly charMap: Int32Array
  protected readonly luts: LUT[]

  readonly settings = new Settings()

  constructor(settings?: Partial<Settings>) {
    overwrite(this.settings, settings!)

    this.api = context2d()()
    this.charMap = this.makeCharMap()
    this.luts = this.makeLUTs()
  }

  private makeCharMap() {
    const { charSet, fontFamily } = this.settings

    const charCodes = [...charSet]
      .filter(monospaced(fontFamily))
      .map(chr)

    return Int32Array.from(charCodes)
  }

  private makeLUTs() {
    const { charMap, settings } = this
    const { lutMin, lutMax } = settings

    const luts = Array.from(charMap, cc => fromCharCode(cc, settings))
    const maxʹ = luts.reduce((acc, lut) => max(acc, ...lut), 0)

    for (const lut of luts)
      lut.normalize(lutMin * maxʹ, lutMax * maxʹ)

    return luts
  }

  render(src: Source, width: number, height: number) {
    return [...this.lines(src, floor(width), floor(height))].join('\n')
  }

  abstract lines(src: Source, width: number, height: number): Generator<string>
}
