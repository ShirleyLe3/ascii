import * as gle from './enums'
import { max } from 'wheels/esm/math'
import { element } from 'wheels/esm/dom'

export type Callback<T = WebGLObject> = (gl: WebGL2RenderingContext, object: T) => void
export type Binder<T = WebGLObject> = (object: T | null) => void
export type Context<T = WebGLObject> = (fn?: Callback<T>) => T
export type Factory<T = WebGLObject> = (gl: WebGL2RenderingContext, target?: GLenum) => Context<T>

export const api = (attributes?: WebGLContextAttributes, ...extensions: string[]) => {
  const canvas = element('canvas')()
  const gl = canvas.getContext('webgl2', attributes)

  if (!gl)
    throw new Error('WebGL2 is not available')

  for (const ext of extensions)
    if (!gl.getExtension(ext))
      throw new Error(`"${ext}" extension is not available`)

  return gl
}

export const shader = (gl: WebGL2RenderingContext, type: GLenum, source: string) => {
  const sourceʹ = '#version 300 es\n' + source
  const shader = gl.createShader(type)!

  gl.shaderSource(shader, sourceʹ)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gle.COMPILE_STATUS))
    throw new Error(`Shader error:\n${gl.getShaderInfoLog(shader)}\n${lineNumbers(sourceʹ)}\n`)

  return shader
}

export const program = (gl: WebGL2RenderingContext, vert: WebGLShader, frag: WebGLShader) => {
  const program = gl.createProgram()!

  gl.attachShader(program, vert)
  gl.attachShader(program, frag)
  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gle.LINK_STATUS))
    throw new Error(`Program error: ${gl.getProgramInfoLog(program)}`)

  return program
}

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

export const uniforms = (gl: WebGL2RenderingContext, program: WebGLProgram) =>
  (name: string) => gl.getUniformLocation(program, name)

//

const zeroPad = (size: number, value: string) =>
  '0'.repeat(max(0, size - value.length)) + value

const lineNumbers = (source: string, n = 1) =>
  source.replace(/^.*/gm, line => zeroPad(5, `${n++}: `) + line)

const context = <T>(gl: WebGL2RenderingContext, object: T, bind: Binder<T>): Context<T> =>
  fn => (fn && (bind(object), fn(gl, object), bind(null)), object)
