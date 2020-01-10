import { context2d } from 'wheels/esm/dom'
import { extend } from 'wheels/esm/object'
import { Source } from '../../types'

const triplet = (w: number, h: number) =>
  extend([w, h, w/h], { width: w, height: h, ratio: w/h })

export const extract = (src: Source) =>
  src instanceof CanvasRenderingContext2D
    ? src.canvas
    : src

export const convert = (src: Source) => {
  if (src instanceof CanvasRenderingContext2D)
    return src

  const api = context2d(measure(src))()
  api.drawImage(src, 0, 0)
  return api
}

export const measure = (src: Source) => {
  if (src instanceof HTMLVideoElement)
    return triplet(src.videoWidth, src.videoHeight)

  if (src instanceof HTMLImageElement)
    return triplet(src.naturalWidth, src.naturalHeight)

  const srcʹ = extract(src)
  return triplet(srcʹ.width, srcʹ.height)
}
