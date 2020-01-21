const str = String.fromCharCode;
const chr = (str) => str.charCodeAt(0);
const extend = Object.assign;
const overwrite = extend;
const render = (str, ctx = {}, ref = '$') => new Function(`{${Object.keys(ctx)}}`, ref, `return \`${str}\``)(ctx, ctx);

const expand = (pair) => {
    const [a, b] = [...pair].map(chr);
    const codes = [...Array(b - a).keys()].map(n => a + n);
    return str(...codes, b);
};
const ascii = expand(' ^') + expand('`~');
const extended = ascii + expand('¡§') + '®°±©«¬´µ·»¿×÷';
const extra = extended + expand('‘•') + '‹›∙√∞';

const charsets = {
    __proto__: null,
    ascii: ascii,
    extended: extended,
    extra: extra
};

const Context = CanvasRenderingContext2D;

const element = name => (...attrs) => overwrite(document.createElement(name), ...attrs);
const canvas = element('canvas');

const triplet = (w, h) => extend([w, h, w / h], { width: w, height: h, ratio: w / h });
const extract = (src) => src instanceof Context
    ? src.canvas
    : src;
const measure = (src) => {
    if (src instanceof HTMLVideoElement)
        return triplet(src.videoWidth, src.videoHeight);
    if (src instanceof HTMLImageElement)
        return triplet(src.naturalWidth, src.naturalHeight);
    const srcʹ = extract(src);
    return triplet(srcʹ.width, srcʹ.height);
};
const context2d = (setup) => {
    const context = canvas().getContext('2d');
    return (width, height) => {
        var _a;
        overwrite(context.canvas, { width, height });
        (_a = setup) === null || _a === void 0 ? void 0 : _a(context);
        return context;
    };
};

const converter = () => {
    const cached = context2d();
    return (src) => {
        const [w, h] = measure(src);
        const dst = cached(w, h);
        dst.drawImage(extract(src), 0, 0);
        return dst;
    };
};
const resizer = () => {
    const cached = context2d();
    return (src, w, h) => {
        const dst = cached(w, h);
        dst.drawImage(extract(src), 0, 0, w, h);
        return dst;
    };
};
const cropper = () => {
    const cached = context2d();
    return (src, w, h, x = 0, y = 0) => {
        const dst = cached(w, h);
        dst.drawImage(extract(src), x, y, w, h, 0, 0, w, h);
        return dst;
    };
};

const { abs, acos, acosh, asin, asinh, atan, atan2, atanh, cbrt, ceil, clz32, cos, cosh, exp, expm1, floor, fround, hypot, imul, log, log10, log1p, log2, max, min, pow, random, round, sign, sin, sinh, sqrt, tan, tanh, trunc, E, LN10, LN2, LOG10E, LOG2E, PI, SQRT1_2, SQRT2 } = Math;

const lum = (r, g, b) => 0.2126  * r + 0.7152  * g + 0.0722  * b;
const rgb = (srgb) => srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;

const msb = (n) => 1 << max(0, 31 - clz32(n));
const resizer$1 = () => {
    const resize = resizer();
    const crop = cropper();
    return (src, w, h) => {
        const [wʹ, hʹ] = measure(src);
        let wʺ = w * msb(wʹ / w - 1);
        let hʺ = h * msb(hʹ / h - 1);
        const tmp = resize(src, wʺ, hʺ);
        if (w === wʺ && h === hʺ)
            return tmp;
        for (let x, y; x = w < wʺ, y = h < hʺ, x || y;)
            tmp.drawImage(tmp.canvas, 0, 0, wʺ, hʺ, 0, 0, wʺ >>= +x, hʺ >>= +y);
        return crop(tmp, w, h);
    };
};
const lazyResizer = () => {
    const resize = resizer$1();
    return (src, w, h) => {
        const [wʹ, hʹ] = measure(src);
        return w !== wʹ || h !== hʹ ? resize(src, w, h) : src;
    };
};

const cached = context2d();
const resize = resizer$1();
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
        const api = cached(fontWidthʹ, fontHeightʹ);
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
        const rgba = resize(api, lutWidthʹ, lutHeightʹ)
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
        for (let i = this.length; i--;)
            this[i] = (this[i] - min) / (max - min);
    }
    compare(other) {
        let acc = 0;
        for (let i = this.length; i--;)
            acc += abs(this[i] - other[i]);
        return acc;
    }
}

const defaults = {
    charSet: ascii,
    fontFamily: 'monospace',
    fontBase: 0.25,
    fontWidth: 40,
    fontHeight: 70,
    fontBlur: 9,
    fontGamma: 1.0,
    lutWidth: 5,
    lutHeight: 7,
    lutPadding: 1,
    lutMin: 0.0,
    lutMax: 1.0,
    lutGamma: 1.0,
    gamma: 1.0,
    signal: 1.0,
    noise: 0.0
};

const monospaced = (font) => {
    const api = context2d(api => api.font = `1em ${font}`)(0, 0);
    const ref = api.measureText(' ');
    return (char) => api.measureText(char).width === ref.width;
};
class Renderer {
    constructor(settings) {
        this._resize = lazyResizer();
        this.settings = { ...defaults, ...settings };
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
        return [...this._lines(src, floor(width), floor(height))].join('\n');
    }
}

class CPURenderer extends Renderer {
    constructor() {
        super(...arguments);
        this._convert = converter();
    }
    *_lines(src, width, height) {
        const { settings, _charMap, _luts, _resize, _convert } = this;
        const { lutWidth, lutHeight, gamma, signal, noise } = settings;
        const srcWidth = lutWidth * width;
        const srcHeight = lutHeight * height;
        const srcʹ = _convert(_resize(src, srcWidth, srcHeight));
        const rgba = srcʹ.getImageData(0, 0, srcWidth, srcHeight).data;
        const buffer = new LUT(lutWidth, lutHeight);
        for (let y = 0; y < srcHeight; y += lutHeight) {
            const codes = [];
            for (let x = 0; x < srcWidth; x += lutWidth) {
                let index = 0;
                let value = Infinity;
                for (let v = 0; v < lutHeight; v++) {
                    for (let u = 0; u < lutWidth; u++) {
                        let i = x + u + (y + v) * srcWidth << 2;
                        const r = rgb(rgba[i++] / 0xff);
                        const g = rgb(rgba[i++] / 0xff);
                        const b = rgb(rgba[i++] / 0xff);
                        const s = lum(r, g, b) ** gamma;
                        const n = random() - 0.5;
                        buffer[index++] = signal * s + noise * n;
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
TRIANGLE_STRIP = 0x0005, ARRAY_BUFFER = 0x8892, STATIC_DRAW = 0x88E4, UNSIGNED_BYTE = 0x1401, INT = 0x1404, FLOAT = 0x1406,
RGBA = 0x1908, FRAGMENT_SHADER = 0x8B30, VERTEX_SHADER = 0x8B31, LINK_STATUS = 0x8B82, NEAREST = 0x2600, TEXTURE_MAG_FILTER = 0x2800, TEXTURE_MIN_FILTER = 0x2801, TEXTURE_2D = 0x0DE1, TEXTURE0 = 0x84C0, COMPILE_STATUS = 0x8B81,
FRAMEBUFFER = 0x8D40, COLOR_ATTACHMENT0 = 0x8CE0;

const RED = 0x1903, RED_INTEGER = 0x8D94, R32F = 0x822E, R32I = 0x8235;

const context = (gl, object, bind) => fn => (fn && (bind(object), fn(gl, object), bind(null)), object);
const uniforms = (gl, program) => (name) => gl.getUniformLocation(program, name);
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

const numbered = (src, n = 1) => src.replace(/^/gm, () => `${n++}: `.padStart(5, '0'));
const api = (attributes, ...extensions) => {
    const gl = canvas().getContext('webgl2', attributes);
    if (!gl)
        throw new Error('WebGL2 is unavailable');
    for (const ext of extensions) {
        if (!gl.getExtension(ext))
            throw new Error(`"${ext}" extension is unavailable`);
    }
    return gl;
};
const shader = (gl, type, source) => {
    const sourceʹ = `#version 300 es\n${source}`;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, sourceʹ);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, COMPILE_STATUS)) {
        const info = gl.getShaderInfoLog(shader);
        throw new Error(`Shader error:\n${info}\n${numbered(sourceʹ)}\n`);
    }
    return shader;
};
const program = (gl, vert, frag) => {
    const program = gl.createProgram();
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, LINK_STATUS)) {
        const info = gl.getProgramInfoLog(program);
        throw new Error(`Program error: ${info}`);
    }
    return program;
};

const base = "in vec2 aPosition;out vec2 vPosition;void main(){vPosition=.5+.5*aPosition;gl_Position=vec4(aPosition,0.,1.);}";
const pass1 = "#define MAP3(fn,v3)vec3(fn(v3.x),fn(v3.y),fn(v3.z))\n#define RGB(v1)mix(v1/12.92,pow((v1+.055)/1.055,2.4),step(.04045,v1))\n#define LUM(v3)dot(MAP3(RGB,v3),vec3(.2126,.7152,.0722))\nprecision highp float;uniform sampler2D uSrc;uniform float uGamma;uniform float uSignal;uniform float uNoise;uniform float uRandom;in vec2 vPosition;out float vOutput;float hash13(vec3 p3){p3=fract(p3*1031.);p3+=dot(p3,p3.yzx+19.19);return fract((p3.x+p3.y)*p3.z);}void main(){vec4 t=texture(uSrc,vPosition);float s=pow(LUM(t),uGamma);float n=hash13(vec3(vPosition,uRandom))-0.5;vOutput=uSignal*s+uNoise*n;}";
const pass2 = "#define U ${width}\n#define V ${height}\n#define X ${width*height}\n#define Y ${chars}\n#define Inf exp(1000.)\n#define Block float[X]\n#define CharCode int\nprecision highp float;uniform sampler2D uSrc;uniform sampler2D uLUT;uniform int uCharMap[Y];in vec2 vPosition;out int vOutput;Block read(){vec2 center=vec2(textureSize(uSrc,0))*vPosition;ivec2 topLeft=ivec2(center+.25)-ivec2(U,V)/2;Block src;for(int v=0;v<V;v++)for(int u=0;u<U;u++)src[u+v*U]=texelFetch(uSrc,topLeft+ivec2(u,v),0).r;return src;}CharCode closest(Block src){struct Pair{float diff;int idx;};Pair closest=Pair(Inf,0);for(int y=0;y<Y;y++){float diff=0.;for(int x=0;x<X;x++)diff+=abs(src[x]-texelFetch(uLUT,ivec2(x,y),0).r);if(closest.diff>diff)closest=Pair(diff,y);}return uCharMap[closest.idx];}void main(){vOutput=closest(read());}";
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
        this._charCodes = new Int32Array();
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
    *_lines(src, width, height) {
        const { settings, _charMap, _lut, _gl, _resize } = this;
        const { _pass1, _pass2, _fbo, _txLUT, _txOdd, _txEven } = this;
        const srcWidth = settings.lutWidth * width;
        const srcHeight = settings.lutHeight * height;
        const srcʹ = extract(_resize(src, srcWidth, srcHeight));
        const uPass1 = uniforms(_gl, _pass1);
        const uPass2 = uniforms(_gl, _pass2);
        const area = width * height;
        if (this._charCodes.length !== area)
            this._charCodes = new Int32Array(area);
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
        _gl.uniform1f(uPass1('uGamma'), settings.gamma);
        _gl.uniform1f(uPass1('uSignal'), settings.signal);
        _gl.uniform1f(uPass1('uNoise'), settings.noise);
        _gl.uniform1f(uPass1('uRandom'), random());
        _gl.viewport(0, 0, srcWidth, srcHeight);
        _gl.drawArrays(TRIANGLE_STRIP, 0, 4);
        _gl.activeTexture(TEXTURE0 + 1 );
        _gl.bindTexture(TEXTURE_2D, _txEven);
        _gl.activeTexture(TEXTURE0 + 0 );
        _gl.bindTexture(TEXTURE_2D, _txOdd);
        _gl.texImage2D(TEXTURE_2D, 0, R32I, srcWidth, srcHeight, 0, RED_INTEGER, INT, null);
        _gl.framebufferTexture2D(FRAMEBUFFER, COLOR_ATTACHMENT0, TEXTURE_2D, _txOdd, 0);
        _gl.useProgram(_pass2);
        _gl.uniform1i(uPass2('uSrc'), 1 );
        _gl.uniform1i(uPass2('uLUT'), 2 );
        _gl.uniform1iv(uPass2('uCharMap'), _charMap);
        _gl.viewport(0, 0, width, height);
        _gl.drawArrays(TRIANGLE_STRIP, 0, 4);
        _gl.readPixels(0, 0, width, height, RED_INTEGER, INT, this._charCodes);
        _gl.bindFramebuffer(FRAMEBUFFER, null);
        for (let i = 0; i < area;)
            yield str(...this._charCodes.subarray(i, i += width));
    }
}

export { CPURenderer, Context, GPURenderer, LUT, Renderer, charsets as charSets, defaults, monospaced };
//# sourceMappingURL=bundle.esm.js.map
