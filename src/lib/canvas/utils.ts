import { Source } from '../../types'

export const extract = (src: Source) =>
  src instanceof CanvasRenderingContext2D
    ? src.canvas
    : src
