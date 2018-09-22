"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Shader_1 = require("../Shader");
const setup_vert_1 = require("glsl/setup.vert");
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
