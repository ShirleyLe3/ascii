import { context2d } from 'wheels/esm/dom'
import { Source } from '../../types'

export const extract = (src: Source) =>
  src instanceof CanvasRenderingContext2D
    ? src.canvas
    : src

export const convert = (src: Source) => {
  if (src instanceof CanvasRenderingContext2D)
    return src

  const { width, height } = src
  const api = context2d({ width, height })()
  api.drawImage(src, 0, 0)
  return api
}
