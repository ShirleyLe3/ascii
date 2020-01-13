export type Callback<T = WebGLObject> = (gl: WebGL2RenderingContext, object: T) => void
export type Binder<T = WebGLObject> = (object: T | null) => void
export type Context<T = WebGLObject> = (fn?: Callback<T>) => T
export type Factory<T = WebGLObject> = (gl: WebGL2RenderingContext, target?: GLenum) => Context<T>
