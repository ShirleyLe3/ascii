"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Shader_1 = require("../Shader");
const pass1_frag_1 = require("glsl/pass1.frag");
class Pass1 extends Shader_1.Shader {
    constructor(regl) {
        super(regl, {
            frag: pass1_frag_1.default,
            framebuffer: regl.prop('dst'),
            uniforms: {
                uSrc: regl.prop('src'),
                uBrightness: regl.prop('brightness'),
                uGamma: regl.prop('gamma'),
                uNoise: regl.prop('noise'),
                uTime: regl.context('time')
            }
        });
    }
}
exports.Pass1 = Pass1;
