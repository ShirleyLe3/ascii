import { Source } from '../../types'
import { context2d, extract, measure } from './utils'

export const converter = () => {
  const cached = context2d()

  return (src: Source) => {
    const [w, h] = measure(src)
    const dst = cached(w, h)
    dst.drawImage(extract(src), 0, 0)
    return dst
  }
}

export const cropper = () => {
  const cached = context2d()

  return (src: Source, x: number, y: number, w: number, h: number) => {
    const dst = cached(w, h)
    dst.drawImage(extract(src), x, y, w, h, 0, 0, w, h)
    return dst
  }
}

export const resizer = () => {
  const cached = context2d()

  return (src: Source, w: number, h: number) => {
    const dst = cached(w, h)
    dst.drawImage(extract(src), 0, 0, w, h)
    return dst
  }
}
