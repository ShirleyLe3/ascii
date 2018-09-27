"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Shader_1 = require("../Shader");
const vert = "attribute vec2 aPosition;varying vec2 vPosition;void main(){vPosition=0.5+(0.5*aPosition);gl_Position=vec4(aPosition,0.,1.);}";
class Setup extends Shader_1.Shader {
    constructor(regl) {
        super(regl, {
            vert: setup_vert_1.default,
            depth: {
                enable: false
            },
            attributes: {
                aPosition: [1, 1, -1, 1, 1, -1, -1, -1]
            },
            primitive: 'triangle strip',
            count: 4
        });
    }
}
exports.Setup = Setup;
