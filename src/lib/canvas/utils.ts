import { Context, Source } from '../../types'
import { canvas } from '../dom'
import { extend, overwrite } from '../utils'

export type Setup = (api: Context, w: number, h: number) => void

const triplet = (w: number, h: number) =>
  extend([w, h, w/h], { width: w, height: h, ratio: w/h })

export const extract = (src: Source) =>
  src instanceof Context
    ? src.canvas
    : src

export const measure = (src: Source) => {
  if (src instanceof HTMLVideoElement)
    return triplet(src.videoWidth, src.videoHeight)

  if (src instanceof HTMLImageElement)
    return triplet(src.naturalWidth, src.naturalHeight)

  const srcʹ = extract(src)
  return triplet(srcʹ.width, srcʹ.height)
}

export const context2d = (setup?: Setup) => {
  const context = canvas().getContext('2d')!

  return (w: number, h: number) => {
    overwrite(context.canvas, { width: w, height: h })
    setup?.(context, w, h)
    return context
  }
}
