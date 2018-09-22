import { Shader } from '../Shader'
import frag from 'glsl/pass1.frag'

export class Pass1 extends Shader {
  constructor(regl: any) {
    super(regl, {
      frag,
      framebuffer: regl.prop('dst'),
      uniforms: {
        uSrc: regl.prop('src'),
        uBrightness: regl.prop('brightness'),
        uGamma: regl.prop('gamma'),
        uNoise: regl.prop('noise'),
        uTime: regl.context('time')
      }
    })
  }
}
