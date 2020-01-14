import * as gle from '../enums';
const context = (gl, object, bind) => fn => (fn && (bind(object), fn(gl, object), bind(null)), object);
export const uniforms = (gl, program) => (name) => gl.getUniformLocation(program, name);
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
//# sourceMappingURL=factories.js.map