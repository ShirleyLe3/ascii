import { Source } from '../../types'
import { context2d, extract, measure, Setup } from './utils'

export const converter = (setup?: Setup) => {
  const cached = context2d(setup)

  return (src: Source) => {
    const [w, h] = measure(src)
    const dst = cached(w, h)
    dst.drawImage(extract(src), 0, 0)
    return dst
  }
}

export const resizer = (setup?: Setup) => {
  const cached = context2d(setup)

  return (src: Source, w: number, h: number) => {
    const dst = cached(w, h)
    dst.drawImage(extract(src), 0, 0, w, h)
    return dst
  }
}

export const cropper = (setup?: Setup) => {
  const cached = context2d(setup)

  return (src: Source, w: number, h: number, x = 0, y = 0) => {
    const dst = cached(w, h)
    dst.drawImage(extract(src), x, y, w, h, 0, 0, w, h)
    return dst
  }
}
