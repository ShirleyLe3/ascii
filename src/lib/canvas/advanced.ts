import { Source } from '../../types'
import { clz32, max } from '../math'
import * as basic from './basic'
import { measure } from './utils'

// most significant bit (but msb(x) is always >=1)
const msb = (n: number) => 1 << max(0, 31 - clz32(n))

export const resizer = () => {
  const resize = basic.resizer()
  const crop = basic.cropper()

  return (src: Source, w: number, h: number) => {
    const [wʹ, hʹ] = measure(src)
    let wʺ = w * msb(wʹ / w - 1)
    let hʺ = h * msb(hʹ / h - 1)
    const tmp = resize(src, wʺ, hʺ)

    if (w === wʺ && h === hʺ)
      return tmp

    for (let x, y; x = w < wʺ, y = h < hʺ, x || y;)
      tmp.drawImage(tmp.canvas, 0, 0, wʺ, hʺ, 0, 0, wʺ >>= +x, hʺ >>= +y)

    return crop(tmp, w, h)
  }
}

export const lazyResizer = () => {
  const resize = resizer()

  return (src: Source, w: number, h: number) => {
    const [wʹ, hʹ] = measure(src)
    return w !== wʹ || h !== hʹ ? resize(src, w, h) : src
  }
}
