import { defaults } from './settings'

export type Settings = typeof defaults
export type Context = CanvasRenderingContext2D
export type Source = Context | CanvasImageSource & TexImageSource

export const Context = CanvasRenderingContext2D
