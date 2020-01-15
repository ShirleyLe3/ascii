import { canvas } from '../../dom';
import * as gle from '../enums';
const numbered = (src, n = 1) => src.replace(/^/gm, () => `${n++}: `.padStart(5, '0'));
export const api = (attributes, ...extensions) => {
    const gl = canvas().getContext('webgl2', attributes);
    if (!gl)
        throw new Error('WebGL2 is unavailable');
    for (const ext of extensions) {
        if (!gl.getExtension(ext))
            throw new Error(`"${ext}" extension is unavailable`);
    }
    return gl;
};
export const shader = (gl, type, source) => {
    const sourceʹ = `#version 300 es\n${source}`;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, sourceʹ);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gle.COMPILE_STATUS)) {
        const info = gl.getShaderInfoLog(shader);
        throw new Error(`Shader error:\n${info}\n${numbered(sourceʹ)}\n`);
    }
    return shader;
};
export const program = (gl, vert, frag) => {
    const program = gl.createProgram();
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gle.LINK_STATUS)) {
        const info = gl.getProgramInfoLog(program);
        throw new Error(`Program error: ${info}`);
    }
    return program;
};
//# sourceMappingURL=helpers.js.map