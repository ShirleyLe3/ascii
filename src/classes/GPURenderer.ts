import { random } from 'wheels/esm/math'
import { extract } from '../lib/canvas/utils'
import * as gle from '../lib/gl/enums'
import * as glu from '../lib/gl/utils'
import { render, str } from '../lib/utils'
import { frag, vert } from '../shaders'
import { Settings, Source } from '../types'
import { LUT } from './LUT'
import { Renderer } from './Renderer'

const enum Attribute { position }
const enum Texture { dst, src, lut }

const filterNearest: glu.Callback = gl => {
  gl.texParameteri(gle.TEXTURE_2D, gle.TEXTURE_MIN_FILTER, gle.NEAREST)
  gl.texParameteri(gle.TEXTURE_2D, gle.TEXTURE_MAG_FILTER, gle.NEAREST)
}

const quadGeometry = (index: number): glu.Callback => gl => {
  const quad = Float32Array.of(1, 1, -1, 1, 1, -1, -1, -1)
  gl.bufferData(gle.ARRAY_BUFFER, quad, gle.STATIC_DRAW)
  gl.vertexAttribPointer(index, 2, gle.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(index)
}

export class GPURenderer extends Renderer {
  private readonly _pass1: WebGLProgram
  private readonly _pass2: WebGLProgram

  private readonly _gl     = glu.api({}, 'EXT_color_buffer_float')
  private readonly _fbo    = glu.framebuffer(this._gl)()
  private readonly _txLUT  = glu.texture(this._gl)(filterNearest)
  private readonly _txOdd  = glu.texture(this._gl)(filterNearest)
  private readonly _txEven = glu.texture(this._gl)(filterNearest)

  private readonly _lut = LUT.combine(this._luts)
  private _charCodes = new Float32Array()

  constructor(settings?: Partial<Settings>) {
    super(settings)

    const vBase = glu.shader(this._gl, gle.VERTEX_SHADER, vert.base)
    const fPass1 = glu.shader(this._gl, gle.FRAGMENT_SHADER, frag.pass1)
    const fPass2 = glu.shader(this._gl, gle.FRAGMENT_SHADER, render(frag.pass2, {
      chars: this._charMap.length,
      width: this.settings.lutWidth,
      height: this.settings.lutHeight
    }))

    this._pass1 = glu.program(this._gl, vBase, fPass1)
    this._pass2 = glu.program(this._gl, vBase, fPass2)

    glu.buffer(this._gl)(quadGeometry(Attribute.position))
  }

  *lines(src: Source, width: number, height: number) {
    const { settings, _charMap, _lut, _gl, _resize } = this
    const { _pass1, _pass2, _fbo, _txLUT, _txOdd, _txEven } = this

    const srcWidth  = settings.lutWidth  * width
    const srcHeight = settings.lutHeight * height
    const srcʹ = extract(_resize(src, srcWidth, srcHeight))

    const uPass1 = glu.uniforms(_gl, _pass1)
    const uPass2 = glu.uniforms(_gl, _pass2)

    const area = width * height
    const size = area << 2
    if (this._charCodes.length !== size)
      this._charCodes = new Float32Array(size)

    // enable framebuffer
    _gl.bindFramebuffer(gle.FRAMEBUFFER, _fbo)

    // 1st pass
    _gl.activeTexture(gle.TEXTURE0 + Texture.lut)
    _gl.bindTexture(gle.TEXTURE_2D, _txLUT)
    _gl.texImage2D(gle.TEXTURE_2D, 0, gle.R32F, _lut.width, _lut.height, 0, gle.RED, gle.FLOAT, _lut)

    _gl.activeTexture(gle.TEXTURE0 + Texture.src)
    _gl.bindTexture(gle.TEXTURE_2D, _txOdd)
    _gl.texImage2D(gle.TEXTURE_2D, 0, gle.RGBA, gle.RGBA, gle.UNSIGNED_BYTE, srcʹ)

    _gl.activeTexture(gle.TEXTURE0 + Texture.dst)
    _gl.bindTexture(gle.TEXTURE_2D, _txEven)
    _gl.texImage2D(gle.TEXTURE_2D, 0, gle.R32F, srcWidth, srcHeight, 0, gle.RED, gle.FLOAT, null)
    _gl.framebufferTexture2D(gle.FRAMEBUFFER, gle.COLOR_ATTACHMENT0, gle.TEXTURE_2D, _txEven, 0)

    _gl.useProgram(_pass1)
    _gl.uniform1i(uPass1('uSrc'), Texture.src)
    _gl.uniform1f(uPass1('uGamma'), settings.gamma)
    _gl.uniform1f(uPass1('uSignal'), settings.signal)
    _gl.uniform1f(uPass1('uNoise'), settings.noise)
    _gl.uniform1f(uPass1('uRandom'), random())
    _gl.viewport(0, 0, srcWidth, srcHeight)
    _gl.drawArrays(gle.TRIANGLE_STRIP, 0, 4)

    // 2nd pass
    _gl.activeTexture(gle.TEXTURE0 + Texture.src)
    _gl.bindTexture(gle.TEXTURE_2D, _txEven)

    _gl.activeTexture(gle.TEXTURE0 + Texture.dst)
    _gl.bindTexture(gle.TEXTURE_2D, _txOdd)
    _gl.texImage2D(gle.TEXTURE_2D, 0, gle.R32F, srcWidth, srcHeight, 0, gle.RED, gle.FLOAT, null)
    _gl.framebufferTexture2D(gle.FRAMEBUFFER, gle.COLOR_ATTACHMENT0, gle.TEXTURE_2D, _txOdd, 0)

    _gl.useProgram(_pass2)
    _gl.uniform1i(uPass2('uSrc'), Texture.src)
    _gl.uniform1i(uPass2('uLUT'), Texture.lut)
    _gl.uniform1iv(uPass2('uCharMap'), _charMap)
    _gl.viewport(0, 0, width, height)
    _gl.drawArrays(gle.TRIANGLE_STRIP, 0, 4)

    // read from framebuffer
    _gl.readPixels(0, 0, width, height, gle.RGBA, gle.FLOAT, this._charCodes)

    // disable framebuffer
    _gl.bindFramebuffer(gle.FRAMEBUFFER, null)

    // rgbargbargba... -> rrr...
    for (let i = 0; i < area; i++)
      this._charCodes[i] = this._charCodes[i << 2]

    for (let i = 0; i < area;)
      yield str(...this._charCodes.subarray(i, i += width))
  }
}
