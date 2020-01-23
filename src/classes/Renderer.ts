import { lazyResizer } from '../lib/canvas/advanced'
import { context2d } from '../lib/canvas/utils'
import { floor, max } from '../lib/math'
import { chr } from '../lib/utils'
import { defaults } from '../settings'
import { Settings, Source } from '../types'
import { LUT } from './LUT'

export const monospaced = (font: string) => {
  const api = context2d(api => api.font = `1em ${font}`)(0, 0)
  const ref = api.measureText(' ')
  return (char: string) => api.measureText(char).width === ref.width
}

export abstract class Renderer {
  readonly settings: Settings
  protected readonly _charMap: Int32Array
  protected readonly _luts: LUT[]
  protected readonly _resize = lazyResizer()

  constructor(settings?: Partial<Settings>) {
    const settingsʹ = { ...defaults, ...settings }
    const { charSet, fontFamily, lutMin, lutMax } = settingsʹ

    const codes = [...charSet].filter(monospaced(fontFamily)).map(chr)
    const luts = Array.from(codes, cc => LUT.fromCharCode(cc, settingsʹ))
    const maxʹ = luts.reduce((acc, lut) => max(acc, ...lut), 0)

    for (const lut of luts)
      lut.normalize(lutMin * maxʹ, lutMax * maxʹ)

    this.settings = settingsʹ
    this._charMap = Int32Array.from(codes)
    this._luts = luts
  }

  render(src: Source, width: number, height: number) {
    return [...this._lines(src, floor(width), floor(height))].join('\n')
  }

  protected abstract _lines(src: Source, width: number, height: number): Generator<string>
}
