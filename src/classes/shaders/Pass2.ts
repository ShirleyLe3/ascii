import { Shader } from '../Shader'
import frag from 'glsl/pass2.frag'

export class Pass2 extends Shader {
  constructor(regl: any) {
    super(regl, {
      frag,
      framebuffer: regl.prop('dst'),
      context: {
        src: regl.prop('src'),
        lut: regl.prop('lut')
      },
      uniforms: {
        uSrc: regl.context('src'),
        uLut: regl.context('lut'),
        uSrcSize: ({ src }: any) => [ src.width, src.height ],
        uLutSize: ({ lut }: any) => [ lut.width, lut.height ]
      }
    })
  }
}
