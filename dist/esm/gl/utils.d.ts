/// <reference types="webgl2" />
export declare type Callback<T = WebGLObject> = (gl: WebGL2RenderingContext, object: T) => void;
export declare type Binder<T = WebGLObject> = (object: T | null) => void;
export declare type Context<T = WebGLObject> = (fn?: Callback<T>) => T;
export declare type Factory<T = WebGLObject> = (gl: WebGL2RenderingContext, target?: GLenum) => Context<T>;
export declare const api: (attributes?: WebGLContextAttributes | undefined, ...extensions: string[]) => WebGL2RenderingContext;
export declare const shader: (gl: WebGL2RenderingContext, type: number, source: string) => WebGLShader;
export declare const program: (gl: WebGL2RenderingContext, vert: WebGLShader, frag: WebGLShader) => WebGLProgram;
export declare const array: Factory<WebGLVertexArrayObject>;
export declare const buffer: Factory<WebGLBuffer>;
export declare const texture: Factory<WebGLTexture>;
export declare const framebuffer: Factory<WebGLFramebuffer>;
export declare const uniforms: (gl: WebGL2RenderingContext, program: WebGLProgram) => (name: string) => WebGLUniformLocation | null;
