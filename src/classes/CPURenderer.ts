import { converter } from '../lib/canvas/basic'
import { random } from '../lib/math'
import { lum, rgb } from '../lib/srgb'
import { str } from '../lib/utils'
import { Source } from '../types'
import { LUT } from './LUT'
import { Renderer } from './Renderer'

export class CPURenderer extends Renderer {
  private readonly _convert = converter()

  protected *_lines(src: Source, width: number, height: number) {
    const { settings, _charMap, _luts, _resize, _convert } = this
    const { lutWidth, lutHeight, gamma, signal, noise } = settings

    const srcWidth  = lutWidth  * width
    const srcHeight = lutHeight * height
    const srcʹ = _convert(_resize(src, srcWidth, srcHeight))

    const rgba = srcʹ.getImageData(0, 0, srcWidth, srcHeight).data
    const buffer = new LUT(lutWidth, lutHeight)

    for (let y = 0; y < srcHeight; y += lutHeight) {
      const codes = []

      for (let x = 0; x < srcWidth; x += lutWidth) {
        let cursor = 0

        for (let v = 0; v < lutHeight; v++) {
          for (let u = 0; u < lutWidth; u++) {
            let i = (x + u) + (y + v)*srcWidth << 2

            const r = rgb(rgba[i++] / 0xff)
            const g = rgb(rgba[i++] / 0xff)
            const b = rgb(rgba[i++] / 0xff)

            const s = lum(r, g, b)**gamma
            const n = random() - 0.5

            buffer[cursor++] = signal*s + noise*n
          }
        }

        codes.push(_charMap[buffer.closest(_luts)])
      }

      yield str(...codes)
    }
  }
}
