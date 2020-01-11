import { defaults } from './settings'

export type Settings = typeof defaults

export type Source =
  CanvasRenderingContext2D |
  CanvasImageSource &
  TexImageSource
