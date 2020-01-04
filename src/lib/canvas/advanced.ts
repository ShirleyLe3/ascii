import { clz32, max } from 'wheels/esm/math'
import { Source } from '../../types'
import * as basic from './basic'
import { extract } from './utils'

// most significant bit (but msb(x) is always >=1)
const msb = (n: number) => 1 << max(0, 31 - clz32(n))

export const resize = (src: Source, w: number, h: number) => {
  const srcʹ = extract(src)
  let wʹ = w * msb(srcʹ.width  / w - 1)
  let hʹ = h * msb(srcʹ.height / h - 1)

  const tmp = basic.resize(src, wʹ, hʹ)
  for (let x, y; x = w < wʹ, y = h < hʹ, x || y;)
    tmp.drawImage(tmp.canvas, 0, 0, wʹ, hʹ, 0, 0, wʹ >>= +x, hʹ >>= +y)

  return basic.crop(tmp, 0, 0, w, h)
}
