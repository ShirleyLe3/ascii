import { defaults } from './settings'

export type Settings = typeof defaults
export type Context = OffscreenCanvasRenderingContext2D
export type Source = Context | CanvasImageSource & TexImageSource

export const Context = OffscreenCanvasRenderingContext2D
