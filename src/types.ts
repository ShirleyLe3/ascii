import { defaults } from './settings'

export type Settings = typeof defaults

export type Source =
  CanvasRenderingContext2D |
  HTMLCanvasElement |
  HTMLImageElement |
  HTMLVideoElement |
  ImageBitmap
