import { extract } from '../lib/canvas/utils'
import * as gle from '../lib/gl/enums'
import * as glu from '../lib/gl/utils'
import { random } from '../lib/math'
import { str } from '../lib/utils'
import { fragment as fs, vertex as vs } from '../shaders'
import { Settings, Source } from '../types'
import { LUT } from './LUT'
import { Renderer } from './Renderer'

const enum Attribute { position }
const enum Texture { dst, src, lut }

const filterNearest: glu.Callback = gl => {
  gl.texParameteri(gle.TEXTURE_2D, gle.TEXTURE_MIN_FILTER, gle.NEAREST)
  gl.texParameteri(gle.TEXTURE_2D, gle.TEXTURE_MAG_FILTER, gle.NEAREST)
}

const triangleGeometry = (index: number): glu.Callback => gl => {
  const vertices = Float32Array.of(-1, -1, 3, -1, -1, 3)
  gl.bufferData(gle.ARRAY_BUFFER, vertices, gle.STATIC_DRAW)
  gl.vertexAttribPointer(index, 2, gle.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(index)
}

export class GPURenderer extends Renderer {
  private readonly _gl: WebGL2RenderingContext
  private readonly _fbo: WebGLFramebuffer
  private readonly _textures: WebGLTexture[]
  private readonly _programs: Record<string, WebGLProgram>
  private _charCodes = new Uint32Array()

  constructor(settings?: Partial<Settings>) {
    super(settings)

    const gl = glu.api({}, 'EXT_color_buffer_float')

    const vsBase  = glu.shader(gl, gle.VERTEX_SHADER, vs.base)
    const fsPass1 = glu.shader(gl, gle.FRAGMENT_SHADER, fs.pass1)
    const fsPass2 = glu.shader(gl, gle.FRAGMENT_SHADER, fs.pass2, {
      chars: this._charMap.length,
      width: this.settings.lutWidth,
      height: this.settings.lutHeight
    })

    this._gl = gl
    this._fbo = glu.framebuffer(gl)()
    this._textures = [
      glu.texture(gl)(filterNearest),
      glu.texture(gl)(filterNearest)
    ]
    this._programs = {
      pass1: glu.program(gl, vsBase, fsPass1),
      pass2: glu.program(gl, vsBase, fsPass2)
    }

    const lut = LUT.combine(this._luts)
    gl.activeTexture(gle.TEXTURE0 + Texture.lut)
    gl.bindTexture(gle.TEXTURE_2D, glu.texture(gl)(filterNearest))
    gl.texImage2D(gle.TEXTURE_2D, 0, gle.R32F, lut.width, lut.height, 0, gle.RED, gle.FLOAT, lut)

    glu.buffer(gl)(triangleGeometry(Attribute.position))
  }

  protected *_lines(src: Source, width: number, height: number) {
    const { settings, _charMap, _resize, _gl } = this
    const { _fbo, _textures, _programs } = this

    const srcWidth  = settings.lutWidth  * width
    const srcHeight = settings.lutHeight * height
    const srcʹ = extract(_resize(src, srcWidth, srcHeight))

    const uPass1 = glu.uniforms(_gl, _programs.pass1)
    const uPass2 = glu.uniforms(_gl, _programs.pass2)

    const area = width * height
    if (this._charCodes.length !== area)
      this._charCodes = new Uint32Array(area)

    // enable framebuffer
    _gl.bindFramebuffer(gle.FRAMEBUFFER, _fbo)

    // 1st pass
    _gl.activeTexture(gle.TEXTURE0 + Texture.src)
    _gl.bindTexture(gle.TEXTURE_2D, _textures[0])
    _gl.texImage2D(gle.TEXTURE_2D, 0, gle.RGBA, gle.RGBA, gle.UNSIGNED_BYTE, srcʹ)

    _gl.activeTexture(gle.TEXTURE0 + Texture.dst)
    _gl.bindTexture(gle.TEXTURE_2D, _textures[1])
    _gl.texImage2D(gle.TEXTURE_2D, 0, gle.R32F, srcWidth, srcHeight, 0, gle.RED, gle.FLOAT, null)
    _gl.framebufferTexture2D(gle.FRAMEBUFFER, gle.COLOR_ATTACHMENT0, gle.TEXTURE_2D, _textures[1], 0)

    _gl.useProgram(_programs.pass1)
    _gl.uniform1i(uPass1('uSrc'), Texture.src)
    _gl.uniform1f(uPass1('uGamma'), settings.gamma)
    _gl.uniform1f(uPass1('uSignal'), settings.signal)
    _gl.uniform1f(uPass1('uNoise'), settings.noise)
    _gl.uniform1f(uPass1('uRandom'), random())
    _gl.viewport(0, 0, srcWidth, srcHeight)
    _gl.drawArrays(gle.TRIANGLES, 0, 3)

    // 2nd pass
    _gl.activeTexture(gle.TEXTURE0 + Texture.src)
    _gl.bindTexture(gle.TEXTURE_2D, _textures[1])

    _gl.activeTexture(gle.TEXTURE0 + Texture.dst)
    _gl.bindTexture(gle.TEXTURE_2D, _textures[0])
    _gl.texImage2D(gle.TEXTURE_2D, 0, gle.R32UI, srcWidth, srcHeight, 0, gle.RED_INTEGER, gle.UNSIGNED_INT, null)
    _gl.framebufferTexture2D(gle.FRAMEBUFFER, gle.COLOR_ATTACHMENT0, gle.TEXTURE_2D, _textures[0], 0)

    _gl.useProgram(_programs.pass2)
    _gl.uniform1i(uPass2('uSrc'), Texture.src)
    _gl.uniform1i(uPass2('uLUT'), Texture.lut)
    _gl.uniform1uiv(uPass2('uCharMap'), _charMap)
    _gl.viewport(0, 0, width, height)
    _gl.drawArrays(gle.TRIANGLES, 0, 3)

    // read from framebuffer
    _gl.readPixels(0, 0, width, height, gle.RED_INTEGER, gle.UNSIGNED_INT, this._charCodes)

    // disable framebuffer
    _gl.bindFramebuffer(gle.FRAMEBUFFER, null)

    for (let i = 0; i < area;)
      yield str(...this._charCodes.subarray(i, i += width))
  }
}
