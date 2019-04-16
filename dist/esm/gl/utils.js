import * as gle from './enums';
import { max } from 'wheels/esm/math';
import { element } from 'wheels/esm/dom';
export const api = (attributes, ...extensions) => {
    const canvas = element('canvas')();
    const gl = canvas.getContext('webgl2', attributes);
    if (!gl)
        throw new Error('WebGL2 is not available');
    for (const ext of extensions)
        if (!gl.getExtension(ext))
            throw new Error(`"${ext}" extension is not available`);
    return gl;
};
export const shader = (gl, type, source) => {
    const sourceʹ = '#version 300 es\n' + source;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, sourceʹ);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gle.COMPILE_STATUS))
        throw new Error(`Shader error:\n${gl.getShaderInfoLog(shader)}\n${number(sourceʹ)}\n`);
    return shader;
};
export const program = (gl, vert, frag) => {
    const program = gl.createProgram();
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gle.LINK_STATUS))
        throw new Error(`Program error: ${gl.getProgramInfoLog(program)}`);
    return program;
};
export const array = gl => {
    const object = gl.createVertexArray();
    return context(gl, object, object => gl.bindVertexArray(object));
};
export const buffer = (gl, target = gle.ARRAY_BUFFER) => {
    const object = gl.createBuffer();
    return context(gl, object, object => gl.bindBuffer(target, object));
};
export const texture = (gl, target = gle.TEXTURE_2D) => {
    const object = gl.createTexture();
    return context(gl, object, object => gl.bindTexture(target, object));
};
export const framebuffer = (gl, target = gle.FRAMEBUFFER) => {
    const object = gl.createFramebuffer();
    return context(gl, object, object => gl.bindFramebuffer(target, object));
};
export const uniforms = (gl, program) => (name) => gl.getUniformLocation(program, name);
const pad = (size, value) => '0'.repeat(max(0, size - value.length)) + value;
const number = (source, n = 1) => source.replace(/^.*/gm, line => pad(5, `${n++}: `) + line);
const context = (gl, object, bind) => fn => (fn && (bind(object), fn(gl, object), bind(null)), object);
