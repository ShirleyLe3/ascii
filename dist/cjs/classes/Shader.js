"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const format_1 = require("wheels/esm/text/format");
const object_1 = require("wheels/esm/object");
class Shader {
    constructor(regl, binds) {
        this.regl = regl;
        this.binds = binds;
    }
    compile(...args) {
        const binds = object_1.copy(this.binds);
        const { vert, frag } = binds;
        if (vert)
            binds.vert = format_1.hashBrackets(vert)(...args);
        if (frag)
            binds.frag = format_1.hashBrackets(frag)(...args);
        this.command = this.regl(binds);
    }
}
exports.Shader = Shader;
