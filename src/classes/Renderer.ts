import { overwrite } from 'wheels/esm/object'
import { context2d } from 'wheels/esm/dom'
import { Setup } from './shaders/Setup'
import { Pass1 } from './shaders/Pass1'
import { Pass2 } from './shaders/Pass2'
import { ASCII } from './ASCII'

export type Renderable =
  HTMLImageElement  |
  HTMLCanvasElement |
  HTMLVideoElement  |
  ImageBitmap

export class Renderer {
  private readonly src: any // regl textures
  private readonly lut: any

  private readonly fbo1: any // regl framebufers
  private readonly fbo2: any

  private readonly setup: Setup
  private readonly pass1: Pass1
  private readonly pass2: Pass2

  private readonly context = context2d()
  private readonly canvas = this.context.canvas
  private bytes = new Uint8Array(1)

  constructor(private readonly ascii: ASCII) {
    const { regl } = ascii

    this.src = regl.texture()
    this.lut = regl.texture()

    this.fbo1 = regl.framebuffer({ depthStencil: false, colorType: 'float' })
    this.fbo2 = regl.framebuffer({ depthStencil: false })

    this.setup = new Setup(regl)
    this.pass1 = new Pass1(regl)
    this.pass2 = new Pass2(regl)
  }

  private resize(renderable: Renderable, width: number, height: number) {
    const { context, canvas, ascii: { settings: { quality } } } = this

    if (quality === 'low')
      return renderable

    if (canvas.width !== width || canvas.height !== height) {
      overwrite(canvas, { width, height })
      context.imageSmoothingQuality = quality
    }

    context.drawImage(renderable, 0, 0, width, height)

    return canvas
  }

  update() {
    const { ascii } = this

    this.lut({
      format: 'alpha',
      type: 'float',
      data: ascii.luts
    })

    this.setup.compile(ascii)
    this.pass1.compile(ascii)
    this.pass2.compile(ascii)
  }

  render(renderable: Renderable, width: number, height: number) {
    const { src, lut, fbo1, fbo2, ascii: { regl, settings } } = this
    const { brightness, gamma, noise } = settings

    const w = settings.lutWidth  * width
    const h = settings.lutHeight * height

    const length = width * height << 2
    if (this.bytes.length !== length)
      this.bytes = new Uint8Array(length)

    src(this.resize(renderable, w, h))

    fbo1.resize(w, h)
    fbo2.resize(width, height)
    regl.poll()

    this.setup.command(() => {
      this.pass1.command({ dst: fbo1, src, brightness, gamma, noise })
      this.pass2.command({ dst: fbo2, src: fbo1, lut }, () => {
        regl.draw()
        regl.read(this.bytes)
      })
    })

    return this.bytes
  }
}
