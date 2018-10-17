"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const template_1 = require("wheels/esm/text/template");
class Shader {
    constructor(regl, binds) {
        this.regl = regl;
        this.binds = binds;
    }
    compile(arg) {
        const { regl, binds } = this;
        const { vert, frag } = binds;
        this.command = regl({
            ...binds,
            ...vert && { vert: template_1.render(vert, arg) },
            ...frag && { frag: template_1.render(frag, arg) }
        });
    }
}
exports.Shader = Shader;
