import { context2d } from 'wheels/esm/dom'
import { Source } from '../../types'
import { extract } from './utils'

export const crop = (src: Source, x: number, y: number, w: number, h: number) => {
  const dst = context2d({ width: w, height: h })()
  dst.drawImage(extract(src), x, y, w, h, 0, 0, w, h)
  return dst
}

export const resize = (src: Source, w: number, h: number) => {
  const dst = context2d({ width: w, height: h })()
  dst.drawImage(extract(src), 0, 0, w, h)
  return dst
}
