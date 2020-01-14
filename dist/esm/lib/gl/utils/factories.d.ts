import { Factory } from './types';
export declare const uniforms: (gl: WebGL2RenderingContext, program: WebGLProgram) => (name: string) => WebGLUniformLocation | null;
export declare const array: Factory<WebGLVertexArrayObject>;
export declare const buffer: Factory<WebGLBuffer>;
export declare const texture: Factory<WebGLTexture>;
export declare const framebuffer: Factory<WebGLFramebuffer>;
//# sourceMappingURL=factories.d.ts.map