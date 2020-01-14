import * as gle from '../enums'
import { element } from 'wheels/esm/dom'

const numbered = (src: string, n = 1) =>
  src.replace(/^/gm, () => `${n++}: `.padStart(5, '0'))

export const api = (attributes?: WebGLContextAttributes, ...extensions: string[]) => {
  const canvas = element('canvas')()
  const gl = canvas.getContext('webgl2', attributes)

  if (!gl)
    throw new Error('WebGL2 is unavailable')

  for (const ext of extensions) {
    if (!gl.getExtension(ext))
      throw new Error(`"${ext}" extension is unavailable`)
  }

  return gl
}

export const shader = (gl: WebGL2RenderingContext, type: GLenum, source: string) => {
  const sourceʹ = `#version 300 es\n${source}`
  const shader = gl.createShader(type)!

  gl.shaderSource(shader, sourceʹ)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gle.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader)
    throw new Error(`Shader error:\n${info}\n${numbered(sourceʹ)}\n`)
  }

  return shader
}

export const program = (gl: WebGL2RenderingContext, vert: WebGLShader, frag: WebGLShader) => {
  const program = gl.createProgram()!

  gl.attachShader(program, vert)
  gl.attachShader(program, frag)
  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gle.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program)
    throw new Error(`Program error: ${info}`)
  }

  return program
}
