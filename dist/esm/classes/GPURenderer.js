import { render } from 'wheels/esm/text/template';
import { resize } from '../canvas';
import * as gle from '../gl/enums';
import * as glu from '../gl/utils';
import { str } from '../utils';
import { combine } from './LUT';
import { Renderer } from './Renderer';
const V_BASE = "in vec2 aPosition;\nout vec2 vPosition;\nvoid main() {\nvPosition = 0.5 + 0.5*aPosition;\ngl_Position = vec4(aPosition, 0., 1.);\n}\n";
const F_PASS1 = "#define MAP3(f, v) vec3(f(v.x), f(v.y), f(v.z))\n#define RGB(x) mix(x/12.92, pow((x+.055)/1.055, 2.4), step(.04045, x))\n#define LUM(x) dot(x, vec3(.2126, .7152, .0722))\nprecision mediump float;\nuniform sampler2D uSrc;\nuniform float uBrightness;\nuniform float uGamma;\nuniform float uNoise;\nuniform float uRandom;\nin vec2 vPosition;\nout vec4 vFragColor;\nfloat hash13(vec3 p3) {\np3 = fract(p3 * 0.1031);\np3 += dot(p3, p3.yzx + 19.19);\nreturn fract((p3.x + p3.y) * p3.z);\n}\nvoid main() {\nvec3 srgb = texture(uSrc, vPosition).rgb;\nfloat signal = uBrightness * pow(LUM(MAP3(RGB, srgb)), uGamma);\nfloat noise = uNoise * (hash13(vec3(gl_FragCoord.xy, 1000.*uRandom)) - 0.5);\nvFragColor = vec4(vec3(clamp(signal + noise, 0., 1.)), 0.);\n}\n";
const F_PASS2 = "#define U ${settings.lutWidth}\n#define V ${settings.lutHeight}\n#define X ${lut.width}\n#define Y ${lut.height}\nprecision mediump float;\nuniform sampler2D uSrc;\nuniform sampler2D uLUT;\nuniform int uCharMap[Y];\nin vec2 vPosition;\nout vec4 vFragColor;\nstruct Result {\nint index;\nfloat value;\n};\nvoid main() {\nResult res = Result(0, float(X));\nivec2 pos = ivec2(vec2(textureSize(uSrc, 0))*vPosition) - ivec2(U, V)/2;\nfloat src[X];\nfor (int v = 0; v < V; v++)\nfor (int u = 0; u < U; u++)\nsrc[u + v*U] = texelFetch(uSrc, pos + ivec2(u, v), 0).r;\nfor (int y = 0; y < Y; y++) {\nfloat value = 0.;\nfor (int x = 0; x < X; x++)\nvalue += abs(src[x] - texelFetch(uLUT, ivec2(x, y), 0).r);\nif (res.value > value)\nres = Result(y, value);\n}\nvFragColor = vec4(uCharMap[res.index], 0, 0, 0);\n}\n";
const filterNearest = gl => {
    gl.texParameteri(gle.TEXTURE_2D, gle.TEXTURE_MIN_FILTER, gle.NEAREST);
    gl.texParameteri(gle.TEXTURE_2D, gle.TEXTURE_MAG_FILTER, gle.NEAREST);
};
const quadGeometry = (index) => gl => {
    const quad = Float32Array.of(1, 1, -1, 1, 1, -1, -1, -1);
    gl.bufferData(gle.ARRAY_BUFFER, quad, gle.STATIC_DRAW);
    gl.vertexAttribPointer(index, 2, gle.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(index);
};
export class GPURenderer extends Renderer {
    constructor(settings) {
        super(settings);
        this.gl = glu.api({}, 'EXT_color_buffer_float');
        this.fbo = glu.framebuffer(this.gl)();
        this.txLUT = glu.texture(this.gl)(filterNearest);
        this.txOdd = glu.texture(this.gl)(filterNearest);
        this.txEven = glu.texture(this.gl)(filterNearest);
        this.lut = combine(this.luts);
        this.indices = new Float32Array();
        const vBase = glu.shader(this.gl, gle.VERTEX_SHADER, render(V_BASE, this));
        const fPass1 = glu.shader(this.gl, gle.FRAGMENT_SHADER, render(F_PASS1, this));
        const fPass2 = glu.shader(this.gl, gle.FRAGMENT_SHADER, render(F_PASS2, this));
        this.pass1 = glu.program(this.gl, vBase, fPass1);
        this.pass2 = glu.program(this.gl, vBase, fPass2);
        glu.buffer(this.gl)(quadGeometry(0 /* position */));
    }
    *lines(src, width, height) {
        const { settings, charMap, lut, gl, pass1, pass2, fbo, txLUT, txOdd, txEven } = this;
        const srcWidth = settings.lutWidth * width;
        const srcHeight = settings.lutHeight * height;
        const srcʹ = resize(src, srcWidth, srcHeight);
        const uPass1 = glu.uniforms(gl, pass1);
        const uPass2 = glu.uniforms(gl, pass2);
        if (this.indices.length !== width * height)
            this.indices = new Float32Array(width * height);
        // enable framebuffer
        gl.bindFramebuffer(gle.FRAMEBUFFER, fbo);
        // 1st pass
        gl.activeTexture(gle.TEXTURE0 + 2 /* lut */);
        gl.bindTexture(gle.TEXTURE_2D, txLUT);
        gl.texImage2D(gle.TEXTURE_2D, 0, gle.R32F, lut.width, lut.height, 0, gle.RED, gle.FLOAT, lut);
        gl.activeTexture(gle.TEXTURE0 + 1 /* src */);
        gl.bindTexture(gle.TEXTURE_2D, txOdd);
        gl.texImage2D(gle.TEXTURE_2D, 0, gle.RGBA, gle.RGBA, gle.UNSIGNED_BYTE, srcʹ.canvas);
        gl.activeTexture(gle.TEXTURE0 + 0 /* dst */);
        gl.bindTexture(gle.TEXTURE_2D, txEven);
        gl.texImage2D(gle.TEXTURE_2D, 0, gle.R32F, srcWidth, srcHeight, 0, gle.RED, gle.FLOAT, null);
        gl.framebufferTexture2D(gle.FRAMEBUFFER, gle.COLOR_ATTACHMENT0, gle.TEXTURE_2D, txEven, 0);
        gl.useProgram(pass1);
        gl.uniform1i(uPass1('uSrc'), 1 /* src */);
        gl.uniform1f(uPass1('uBrightness'), settings.brightness);
        gl.uniform1f(uPass1('uGamma'), settings.gamma);
        gl.uniform1f(uPass1('uNoise'), settings.noise);
        gl.uniform1f(uPass1('uRandom'), Math.random());
        gl.viewport(0, 0, srcWidth, srcHeight);
        gl.drawArrays(gle.TRIANGLE_STRIP, 0, 4);
        // 2nd pass
        gl.activeTexture(gle.TEXTURE0 + 1 /* src */);
        gl.bindTexture(gle.TEXTURE_2D, txEven);
        gl.activeTexture(gle.TEXTURE0 + 0 /* dst */);
        gl.bindTexture(gle.TEXTURE_2D, txOdd);
        gl.texImage2D(gle.TEXTURE_2D, 0, gle.R32F, srcWidth, srcHeight, 0, gle.RED, gle.FLOAT, null);
        gl.framebufferTexture2D(gle.FRAMEBUFFER, gle.COLOR_ATTACHMENT0, gle.TEXTURE_2D, txOdd, 0);
        gl.useProgram(pass2);
        gl.uniform1i(uPass2('uSrc'), 1 /* src */);
        gl.uniform1i(uPass2('uLUT'), 2 /* lut */);
        gl.uniform1iv(uPass2('uCharMap'), charMap);
        gl.viewport(0, 0, width, height);
        gl.drawArrays(gle.TRIANGLE_STRIP, 0, 4);
        // read from framebuffer
        gl.readPixels(0, 0, width, height, gle.RED, gle.FLOAT, this.indices);
        // disable framebuffer
        gl.bindFramebuffer(gle.FRAMEBUFFER, null);
        for (let i = 0; i < this.indices.length;)
            yield str(...this.indices.subarray(i, i += width));
    }
}
//# sourceMappingURL=GPURenderer.js.map