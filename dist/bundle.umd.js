(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.ascii = {}));
}(this, (function (exports) { 'use strict';

    const extend = Object.assign;
    const overwrite = extend;

    const context2d = (...attributes) => (...settings) => overwrite(element('canvas')(...attributes).getContext('2d'), ...settings);
    const element = (name) => (...attributes) => overwrite(document.createElement(name), ...attributes);

    const str = String.fromCharCode;
    const chr = (str) => str.charCodeAt(0);
    const render = (str, ctx = {}, ref = '$') => new Function(`{${Object.keys(ctx)}}`, ref, `return \`${str}\``)(ctx, ctx);
    const monospaced = (font) => {
        const api = context2d()({ font: `1em ${font}` });
        const ref = api.measureText(' ');
        return (char) => api.measureText(char).width === ref.width;
    };

    const expand = (pair) => {
        const [a, b] = [...pair].map(chr);
        const codes = [...Array(b - a).keys()].map(n => a + n);
        return str(...codes, b);
    };
    const ascii = expand(' ^') + expand('`~');
    const extended = ascii + expand('¡§') + '®°±©«¬´µ·»¿×÷';
    const extra = extended + expand('‘•') + '‹›∙√∞';

    const charsets = ({
        __proto__: null,
        ascii: ascii,
        extended: extended,
        extra: extra
    });

    const rgb = (srgb) => srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;

    const { abs, acos, acosh, asin, asinh, atan, atan2, atanh, cbrt, ceil, clz32, cos, cosh, exp, expm1, floor, fround, hypot, imul, log, log10, log1p, log2, max, min, pow, random, round, sign, sin, sinh, sqrt, tan, tanh, trunc, E, LN10, LN2, LOG10E, LOG2E, PI, SQRT1_2, SQRT2 } = Math;

    const extract = (src) => src instanceof CanvasRenderingContext2D
        ? src.canvas
        : src;
    const convert = (src) => {
        if (src instanceof CanvasRenderingContext2D)
            return src;
        const { width, height } = src;
        const api = context2d({ width, height })();
        api.drawImage(src, 0, 0);
        return api;
    };

    const crop = (src, x, y, w, h) => {
        const dst = context2d({ width: w, height: h })();
        dst.drawImage(extract(src), x, y, w, h, 0, 0, w, h);
        return dst;
    };
    const resize = (src, w, h) => {
        const dst = context2d({ width: w, height: h })();
        dst.drawImage(extract(src), 0, 0, w, h);
        return dst;
    };

    const msb = (n) => 1 << max(0, 31 - clz32(n));
    const resize$1 = (src, w, h) => {
        const srcʹ = extract(src);
        let wʹ = w * msb(srcʹ.width / w - 1);
        let hʹ = h * msb(srcʹ.height / h - 1);
        const tmp = resize(src, wʹ, hʹ);
        if (w === wʹ && h === hʹ)
            return tmp;
        for (let x, y; x = w < wʹ, y = h < hʹ, x || y;)
            tmp.drawImage(tmp.canvas, 0, 0, wʹ, hʹ, 0, 0, wʹ >>= +x, hʹ >>= +y);
        return crop(tmp, 0, 0, w, h);
    };
    const resizeIfNeeded = (src, w, h) => {
        const { width: wʹ, height: hʹ } = extract(src);
        return w !== wʹ || h !== hʹ ? resize$1(src, w, h) : src;
    };

    class LUT extends Float32Array {
        constructor(width, height) {
            super(width * height);
            this.width = width;
            this.height = height;
        }
        static fromCharCode(charCode, settings) {
            const { fontWidth, fontHeight, fontFamily, fontBlur, fontGamma } = settings;
            const { fontBase, lutWidth, lutHeight, lutPadding, lutGamma } = settings;
            const lutWidthʹ = lutPadding * 2 + lutWidth;
            const lutHeightʹ = lutPadding * 2 + lutHeight;
            const fontWidthʹ = round(lutWidthʹ / lutWidth * fontWidth);
            const fontHeightʹ = round(lutHeightʹ / lutHeight * fontHeight);
            const api = context2d({ width: fontWidthʹ, height: fontHeightʹ })();
            const char = str(charCode);
            api.fillStyle = "#00f" ;
            api.fillRect(0, 0, fontWidthʹ, fontHeightʹ);
            api.translate(fontWidthʹ / 2, fontHeightʹ / 2);
            api.fillStyle = "#000" ;
            api.fillRect(-fontWidth / 2, -fontHeight / 2, fontWidth, fontHeight);
            api.translate(0, fontHeight * (0.5 - fontBase));
            api.fillStyle = "#fff" ;
            api.textAlign = 'center';
            api.font = `${fontHeight}px ${fontFamily}`;
            for (let i = 0, m = 1, n = 1; i < fontBlur; [m, n] = [n, n + m]) {
                api.filter = `blur(${n}px)`;
                api.globalAlpha = (++i / fontBlur) ** fontGamma;
                api.fillText(char, 0, 0);
            }
            const lut = new LUT(lutWidth, lutHeight);
            const rgba = resize$1(api, lutWidthʹ, lutHeightʹ)
                .getImageData(lutPadding, lutPadding, lutWidth, lutHeight)
                .data;
            for (let i = 0; i < lut.length; i++)
                lut[i] = rgb(rgba[i << 2] / 0xff) ** lutGamma;
            return lut;
        }
        static combine(luts) {
            const width = luts[0].length;
            const height = luts.length;
            const lut = new LUT(width, height);
            for (let i = 0; i < height; i++)
                lut.set(luts[i], i * width);
            return lut;
        }
        normalize(min, max) {
            for (let i = 0; i < this.length; i++)
                this[i] = (this[i] - min) / (max - min);
        }
        compare(other) {
            let acc = 0;
            for (let i = this.length; i--;)
                acc += abs(this[i] - other[i]);
            return acc;
        }
    }

    class Settings {
        constructor() {
            this.charSet = ascii;
            this.fontFamily = 'monospace';
            this.fontBase = 0.25;
            this.fontWidth = 40;
            this.fontHeight = 70;
            this.fontBlur = 9;
            this.fontGamma = 1.0;
            this.lutWidth = 5;
            this.lutHeight = 7;
            this.lutPadding = 1;
            this.lutMin = 0.0;
            this.lutMax = 1.0;
            this.lutGamma = 1.0;
            this.brightness = 1.0;
            this.gamma = 1.0;
            this.noise = 0.0;
        }
    }

    class Renderer {
        constructor(settings) {
            this.settings = new Settings();
            overwrite(this.settings, settings);
            this._charMap = this._makeCharMap();
            this._luts = this._makeLUTs();
        }
        _makeCharMap() {
            const { charSet, fontFamily } = this.settings;
            const charCodes = [...charSet]
                .filter(monospaced(fontFamily))
                .map(chr);
            return Int32Array.from(charCodes);
        }
        _makeLUTs() {
            const { _charMap, settings } = this;
            const { lutMin, lutMax } = settings;
            const luts = Array.from(_charMap, cc => LUT.fromCharCode(cc, settings));
            const maxʹ = luts.reduce((acc, lut) => max(acc, ...lut), 0);
            for (const lut of luts)
                lut.normalize(lutMin * maxʹ, lutMax * maxʹ);
            return luts;
        }
        render(src, width, height) {
            return [...this.lines(src, floor(width), floor(height))].join('\n');
        }
    }

    class CPURenderer extends Renderer {
        *lines(src, width, height) {
            const { settings, _charMap, _luts } = this;
            const { lutWidth, lutHeight, brightness, gamma, noise } = settings;
            const srcWidth = lutWidth * width;
            const srcHeight = lutHeight * height;
            const srcʹ = convert(resizeIfNeeded(src, srcWidth, srcHeight));
            const rgba = srcʹ.getImageData(0, 0, srcWidth, srcHeight).data;
            const buffer = new Float32Array(lutWidth * lutHeight);
            for (let y = 0; y < srcHeight; y += lutHeight) {
                const codes = [];
                for (let x = 0; x < srcWidth; x += lutWidth) {
                    let index = 0;
                    let value = Infinity;
                    for (let v = 0; v < lutHeight; v++) {
                        for (let u = 0; u < lutWidth; u++) {
                            let i = x + u + (y + v) * srcWidth << 2;
                            const r = 0.2126  * rgb(rgba[i++] / 0xff);
                            const g = 0.7152  * rgb(rgba[i++] / 0xff);
                            const b = 0.0722  * rgb(rgba[i++] / 0xff);
                            const s = brightness * (r + g + b) ** gamma;
                            const n = noise * (random() - 0.5);
                            buffer[index++] = s + n;
                        }
                    }
                    for (let i = _luts.length; i--;) {
                        const delta = _luts[i].compare(buffer);
                        if (delta < value) {
                            value = delta;
                            index = i;
                        }
                    }
                    codes.push(_charMap[index]);
                }
                yield str(...codes);
            }
        }
    }

    const 
    TRIANGLE_STRIP = 0x0005, ARRAY_BUFFER = 0x8892, STATIC_DRAW = 0x88E4, UNSIGNED_BYTE = 0x1401, FLOAT = 0x1406,
    RGBA = 0x1908, FRAGMENT_SHADER = 0x8B30, VERTEX_SHADER = 0x8B31, LINK_STATUS = 0x8B82, NEAREST = 0x2600, TEXTURE_MAG_FILTER = 0x2800, TEXTURE_MIN_FILTER = 0x2801, TEXTURE_2D = 0x0DE1, TEXTURE0 = 0x84C0, COMPILE_STATUS = 0x8B81,
    FRAMEBUFFER = 0x8D40, COLOR_ATTACHMENT0 = 0x8CE0;

    const RED = 0x1903, R32F = 0x822E;

    const api = (attributes, ...extensions) => {
        const canvas = element('canvas')();
        const gl = canvas.getContext('webgl2', attributes);
        if (!gl)
            throw new Error('WebGL2 is not available');
        for (const ext of extensions) {
            if (!gl.getExtension(ext))
                throw new Error(`"${ext}" extension is not available`);
        }
        return gl;
    };
    const shader = (gl, type, source) => {
        const sourceʹ = `#version 300 es\n${source}`;
        const shader = gl.createShader(type);
        gl.shaderSource(shader, sourceʹ);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, COMPILE_STATUS))
            throw new Error(`Shader error:\n${gl.getShaderInfoLog(shader)}\n${lineNumbers(sourceʹ)}\n`);
        return shader;
    };
    const program = (gl, vert, frag) => {
        const program = gl.createProgram();
        gl.attachShader(program, vert);
        gl.attachShader(program, frag);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, LINK_STATUS))
            throw new Error(`Program error: ${gl.getProgramInfoLog(program)}`);
        return program;
    };
    const buffer = (gl, target = ARRAY_BUFFER) => {
        const object = gl.createBuffer();
        return context(gl, object, object => gl.bindBuffer(target, object));
    };
    const texture = (gl, target = TEXTURE_2D) => {
        const object = gl.createTexture();
        return context(gl, object, object => gl.bindTexture(target, object));
    };
    const framebuffer = (gl, target = FRAMEBUFFER) => {
        const object = gl.createFramebuffer();
        return context(gl, object, object => gl.bindFramebuffer(target, object));
    };
    const uniforms = (gl, program) => (name) => gl.getUniformLocation(program, name);
    const lineNumbers = (source, n = 1) => source.replace(/^/gm, () => `${n++}: `.padStart(5, '0'));
    const context = (gl, object, bind) => fn => (fn && (bind(object), fn(gl, object), bind(null)), object);

    const base = "in vec2 aPosition;\nout vec2 vPosition;\nvoid main() {\nvPosition = 0.5 + 0.5*aPosition;\ngl_Position = vec4(aPosition, 0., 1.);\n}\n";
    const pass1 = "#define MAP3(f, v) vec3(f(v.x), f(v.y), f(v.z))\n#define RGB(x) mix(x/12.92, pow((x+.055)/1.055, 2.4), step(.04045, x))\n#define LUM(x) dot(x, vec3(.2126, .7152, .0722))\nprecision mediump float;\nuniform sampler2D uSrc;\nuniform float uBrightness;\nuniform float uGamma;\nuniform float uNoise;\nuniform float uRandom;\nin vec2 vPosition;\nout vec4 vFragColor;\nfloat hash13(vec3 p3) {\np3 = fract(p3 * 0.1031);\np3 += dot(p3, p3.yzx + 19.19);\nreturn fract((p3.x + p3.y) * p3.z);\n}\nvoid main() {\nvec3 srgb = texture(uSrc, vPosition).rgb;\nfloat signal = uBrightness * pow(LUM(MAP3(RGB, srgb)), uGamma);\nfloat noise = uNoise * (hash13(vec3(gl_FragCoord.xy, 1000.*uRandom)) - 0.5);\nvFragColor = vec4(vec3(clamp(signal + noise, 0., 1.)), 0.);\n}\n";
    const pass2 = "#define U ${ width }\n#define V ${ height }\n#define X ${ width * height }\n#define Y ${ chars }\nprecision mediump float;\nuniform sampler2D uSrc;\nuniform sampler2D uLUT;\nuniform int uCharMap[Y];\nin vec2 vPosition;\nout vec4 vFragColor;\nstruct Result {\nint index;\nfloat value;\n};\nvoid main() {\nResult res = Result(0, float(X));\nivec2 pos = ivec2(vec2(textureSize(uSrc, 0))*vPosition) - ivec2(U, V)/2;\nfloat src[X];\nfor (int v = 0; v < V; v++)\nfor (int u = 0; u < U; u++)\nsrc[u + v*U] = texelFetch(uSrc, pos + ivec2(u, v), 0).r;\nfor (int y = 0; y < Y; y++) {\nfloat value = 0.;\nfor (int x = 0; x < X; x++)\nvalue += abs(src[x] - texelFetch(uLUT, ivec2(x, y), 0).r);\nif (res.value > value)\nres = Result(y, value);\n}\nvFragColor = vec4(uCharMap[res.index], 0, 0, 0);\n}\n";
    const vert = { base };
    const frag = { pass1, pass2 };

    const filterNearest = gl => {
        gl.texParameteri(TEXTURE_2D, TEXTURE_MIN_FILTER, NEAREST);
        gl.texParameteri(TEXTURE_2D, TEXTURE_MAG_FILTER, NEAREST);
    };
    const quadGeometry = (index) => gl => {
        const quad = Float32Array.of(1, 1, -1, 1, 1, -1, -1, -1);
        gl.bufferData(ARRAY_BUFFER, quad, STATIC_DRAW);
        gl.vertexAttribPointer(index, 2, FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(index);
    };
    class GPURenderer extends Renderer {
        constructor(settings) {
            super(settings);
            this._gl = api({}, 'EXT_color_buffer_float');
            this._fbo = framebuffer(this._gl)();
            this._txLUT = texture(this._gl)(filterNearest);
            this._txOdd = texture(this._gl)(filterNearest);
            this._txEven = texture(this._gl)(filterNearest);
            this._lut = LUT.combine(this._luts);
            this._charCodes = new Float32Array();
            const vBase = shader(this._gl, VERTEX_SHADER, vert.base);
            const fPass1 = shader(this._gl, FRAGMENT_SHADER, frag.pass1);
            const fPass2 = shader(this._gl, FRAGMENT_SHADER, render(frag.pass2, {
                chars: this._charMap.length,
                width: this.settings.lutWidth,
                height: this.settings.lutHeight
            }));
            this._pass1 = program(this._gl, vBase, fPass1);
            this._pass2 = program(this._gl, vBase, fPass2);
            buffer(this._gl)(quadGeometry(0 ));
        }
        *lines(src, width, height) {
            const { settings, _charMap, _lut, _gl, _pass1, _pass2, _fbo, _txLUT, _txOdd, _txEven } = this;
            const srcWidth = settings.lutWidth * width;
            const srcHeight = settings.lutHeight * height;
            const srcʹ = extract(resizeIfNeeded(src, srcWidth, srcHeight));
            const uPass1 = uniforms(_gl, _pass1);
            const uPass2 = uniforms(_gl, _pass2);
            if (this._charCodes.length !== width * height)
                this._charCodes = new Float32Array(width * height);
            _gl.bindFramebuffer(FRAMEBUFFER, _fbo);
            _gl.activeTexture(TEXTURE0 + 2 );
            _gl.bindTexture(TEXTURE_2D, _txLUT);
            _gl.texImage2D(TEXTURE_2D, 0, R32F, _lut.width, _lut.height, 0, RED, FLOAT, _lut);
            _gl.activeTexture(TEXTURE0 + 1 );
            _gl.bindTexture(TEXTURE_2D, _txOdd);
            _gl.texImage2D(TEXTURE_2D, 0, RGBA, RGBA, UNSIGNED_BYTE, srcʹ);
            _gl.activeTexture(TEXTURE0 + 0 );
            _gl.bindTexture(TEXTURE_2D, _txEven);
            _gl.texImage2D(TEXTURE_2D, 0, R32F, srcWidth, srcHeight, 0, RED, FLOAT, null);
            _gl.framebufferTexture2D(FRAMEBUFFER, COLOR_ATTACHMENT0, TEXTURE_2D, _txEven, 0);
            _gl.useProgram(_pass1);
            _gl.uniform1i(uPass1('uSrc'), 1 );
            _gl.uniform1f(uPass1('uBrightness'), settings.brightness);
            _gl.uniform1f(uPass1('uGamma'), settings.gamma);
            _gl.uniform1f(uPass1('uNoise'), settings.noise);
            _gl.uniform1f(uPass1('uRandom'), Math.random());
            _gl.viewport(0, 0, srcWidth, srcHeight);
            _gl.drawArrays(TRIANGLE_STRIP, 0, 4);
            _gl.activeTexture(TEXTURE0 + 1 );
            _gl.bindTexture(TEXTURE_2D, _txEven);
            _gl.activeTexture(TEXTURE0 + 0 );
            _gl.bindTexture(TEXTURE_2D, _txOdd);
            _gl.texImage2D(TEXTURE_2D, 0, R32F, srcWidth, srcHeight, 0, RED, FLOAT, null);
            _gl.framebufferTexture2D(FRAMEBUFFER, COLOR_ATTACHMENT0, TEXTURE_2D, _txOdd, 0);
            _gl.useProgram(_pass2);
            _gl.uniform1i(uPass2('uSrc'), 1 );
            _gl.uniform1i(uPass2('uLUT'), 2 );
            _gl.uniform1iv(uPass2('uCharMap'), _charMap);
            _gl.viewport(0, 0, width, height);
            _gl.drawArrays(TRIANGLE_STRIP, 0, 4);
            _gl.readPixels(0, 0, width, height, RED, FLOAT, this._charCodes);
            _gl.bindFramebuffer(FRAMEBUFFER, null);
            for (let i = 0; i < this._charCodes.length;)
                yield str(...this._charCodes.subarray(i, i += width));
        }
    }

    exports.CPURenderer = CPURenderer;
    exports.GPURenderer = GPURenderer;
    exports.LUT = LUT;
    exports.Renderer = Renderer;
    exports.Settings = Settings;
    exports.charSets = charsets;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=bundle.umd.js.map
