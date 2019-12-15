import * as gle from '../gl/enums'
import * as glu from '../gl/utils'
import { render } from 'wheels/esm/text/template'
import { str } from '../utils'
import { Renderer, Renderable } from './Renderer'
import { Settings } from './Settings'
import { combine } from './LUT'

import V_BASE  from 'glsl/base.vert'
import F_PASS1 from 'glsl/pass1.frag'
import F_PASS2 from 'glsl/pass2.frag'

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
  private readonly pass1: WebGLProgram
  private readonly pass2: WebGLProgram

  private readonly gl     = glu.api({}, 'EXT_color_buffer_float')
  private readonly fbo    = glu.framebuffer(this.gl)()
  private readonly txLUT  = glu.texture(this.gl)(filterNearest)
  private readonly txOdd  = glu.texture(this.gl)(filterNearest)
  private readonly txEven = glu.texture(this.gl)(filterNearest)

  private readonly lut = combine(...this.luts)
  private indices = new Float32Array()

  constructor(settings?: Partial<Settings>) {
    super(settings)

    const vBase  = glu.shader(this.gl, gle.VERTEX_SHADER,   render(V_BASE,  this))
    const fPass1 = glu.shader(this.gl, gle.FRAGMENT_SHADER, render(F_PASS1, this))
    const fPass2 = glu.shader(this.gl, gle.FRAGMENT_SHADER, render(F_PASS2, this))

    this.pass1 = glu.program(this.gl, vBase, fPass1)
    this.pass2 = glu.program(this.gl, vBase, fPass2)

    glu.buffer(this.gl)(quadGeometry(Attribute.position))
  }

  *lines(renderable: Renderable, width: number, height: number) {
    const { settings, charMap, lut, gl, pass1, pass2, fbo, txLUT, txOdd, txEven } = this

    const srcWidth  = settings.lutWidth  * width
    const srcHeight = settings.lutHeight * height
    const src = this.resize(renderable, srcWidth, srcHeight).canvas

    const uPass1 = glu.uniforms(gl, pass1)
    const uPass2 = glu.uniforms(gl, pass2)

    if (this.indices.length !== width * height)
      this.indices = new Float32Array(width * height)

    // enable framebuffer
    gl.bindFramebuffer(gle.FRAMEBUFFER, fbo)

    // 1st pass
    gl.activeTexture(gle.TEXTURE0 + Texture.lut)
    gl.bindTexture(gle.TEXTURE_2D, txLUT)
    gl.texImage2D(gle.TEXTURE_2D, 0, gle.R32F, lut.width, lut.height, 0, gle.RED, gle.FLOAT, lut)

    gl.activeTexture(gle.TEXTURE0 + Texture.src)
    gl.bindTexture(gle.TEXTURE_2D, txOdd)
    gl.texImage2D(gle.TEXTURE_2D, 0, gle.RGBA, gle.RGBA, gle.UNSIGNED_BYTE, src)

    gl.activeTexture(gle.TEXTURE0 + Texture.dst)
    gl.bindTexture(gle.TEXTURE_2D, txEven)
    gl.texImage2D(gle.TEXTURE_2D, 0, gle.R32F, srcWidth, srcHeight, 0, gle.RED, gle.FLOAT, null)
    gl.framebufferTexture2D(gle.FRAMEBUFFER, gle.COLOR_ATTACHMENT0, gle.TEXTURE_2D, txEven, 0)

    gl.useProgram(pass1)
    gl.uniform1i(uPass1('uSrc'), Texture.src)
    gl.uniform1f(uPass1('uBrightness'), settings.brightness)
    gl.uniform1f(uPass1('uGamma'), settings.gamma)
    gl.uniform1f(uPass1('uNoise'), settings.noise)
    gl.uniform1f(uPass1('uRandom'), Math.random())
    gl.viewport(0, 0, srcWidth, srcHeight)
    gl.drawArrays(gle.TRIANGLE_STRIP, 0, 4)

    // 2nd pass
    gl.activeTexture(gle.TEXTURE0 + Texture.src)
    gl.bindTexture(gle.TEXTURE_2D, txEven)

    gl.activeTexture(gle.TEXTURE0 + Texture.dst)
    gl.bindTexture(gle.TEXTURE_2D, txOdd)
    gl.texImage2D(gle.TEXTURE_2D, 0, gle.R32F, srcWidth, srcHeight, 0, gle.RED, gle.FLOAT, null)
    gl.framebufferTexture2D(gle.FRAMEBUFFER, gle.COLOR_ATTACHMENT0, gle.TEXTURE_2D, txOdd, 0)

    gl.useProgram(pass2)
    gl.uniform1i(uPass2('uSrc'), Texture.src)
    gl.uniform1i(uPass2('uLUT'), Texture.lut)
    gl.viewport(0, 0, width, height)
    gl.drawArrays(gle.TRIANGLE_STRIP, 0, 4)

    // read from framebuffer
    gl.readPixels(0, 0, width, height, gle.RED, gle.FLOAT, this.indices)

    // disable framebuffer
    gl.bindFramebuffer(gle.FRAMEBUFFER, null)

    for (let i = 0; i < this.indices.length;) {
      const slice = this.indices.subarray(i, i += width)
      const codes = Array.from(slice, i => charMap[i])
      yield str(...codes)
    }
  }
}
