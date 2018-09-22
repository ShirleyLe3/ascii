import { Shader } from '../Shader';
import frag from 'glsl/pass2.frag';
export class Pass2 extends Shader {
    constructor(regl) {
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
                uSrcSize: ({ src }) => [src.width, src.height],
                uLutSize: ({ lut }) => [lut.width, lut.height]
            }
        });
    }
}
