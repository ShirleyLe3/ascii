import { floor, max } from 'wheels/esm/math'
import { chr, monospaced } from '../lib/utils'
import { defaults } from '../settings'
import { Settings, Source } from '../types'
import { LUT } from './LUT'

export abstract class Renderer {
  readonly settings: Settings
  protected readonly _charMap: Int32Array
  protected readonly _luts: LUT[]

  constructor(settings?: Partial<Settings>) {
    this.settings = { ...defaults, ...settings }
    this._charMap = this._makeCharMap()
    this._luts = this._makeLUTs()
  }

  private _makeCharMap() {
    const { charSet, fontFamily } = this.settings

    const charCodes = [...charSet]
      .filter(monospaced(fontFamily))
      .map(chr)

    return Int32Array.from(charCodes)
  }

  private _makeLUTs() {
    const { _charMap, settings } = this
    const { lutMin, lutMax } = settings

    const luts = Array.from(_charMap, cc => LUT.fromCharCode(cc, settings))
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
