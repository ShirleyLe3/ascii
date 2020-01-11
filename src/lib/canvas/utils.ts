import { element } from 'wheels/esm/dom'
import { extend, overwrite } from 'wheels/esm/object'
import { Context, Source } from '../../types'

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

export const context2d = (setup?: (api: Context) => void) => {
  const canvas = element('canvas')()
  const context = canvas.getContext('2d')!

  return (width: number, height: number) => {
    overwrite(canvas, { width, height })
    setup?.(context)
    return context
  }
}
