import * as gle from '../enums'
import { Binder, Context, Factory } from './types'

const context = <T>(gl: WebGL2RenderingContext, object: T, bind: Binder<T>): Context<T> =>
  fn => (fn && (bind(object), fn(gl, object), bind(null)), object)

export const uniforms = (gl: WebGL2RenderingContext, program: WebGLProgram) =>
  (name: string) => gl.getUniformLocation(program, name)

export const array: Factory<WebGLVertexArrayObject> = gl => {
  const object = gl.createVertexArray()!
  return context(gl, object, object => gl.bindVertexArray(object))
}

export const buffer: Factory<WebGLBuffer> = (gl, target = gle.ARRAY_BUFFER) => {
  const object = gl.createBuffer()!
  return context(gl, object, object => gl.bindBuffer(target, object))
}

export const texture: Factory<WebGLTexture> = (gl, target = gle.TEXTURE_2D) => {
  const object = gl.createTexture()!
  return context(gl, object, object => gl.bindTexture(target, object))
}

export const framebuffer: Factory<WebGLFramebuffer> = (gl, target = gle.FRAMEBUFFER) => {
  const object = gl.createFramebuffer()!
  return context(gl, object, object => gl.bindFramebuffer(target, object))
}
