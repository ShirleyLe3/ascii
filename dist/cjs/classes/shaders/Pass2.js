"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Shader_1 = require("../Shader");
const pass2_frag_1 = require("glsl/pass2.frag");
class Pass2 extends Shader_1.Shader {
    constructor(regl) {
        super(regl, {
            frag: pass2_frag_1.default,
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
exports.Pass2 = Pass2;
