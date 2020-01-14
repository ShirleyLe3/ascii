export declare type Callback<T = WebGLObject> = (gl: WebGL2RenderingContext, object: T) => void;
export declare type Binder<T = WebGLObject> = (object: T | null) => void;
export declare type Context<T = WebGLObject> = (fn?: Callback<T>) => T;
export declare type Factory<T = WebGLObject> = (gl: WebGL2RenderingContext, target?: GLenum) => Context<T>;
//# sourceMappingURL=types.d.ts.map