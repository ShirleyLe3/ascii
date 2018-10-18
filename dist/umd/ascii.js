(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.ASCII = factory());
}(this, (function () { 'use strict';

    const rgb = (srgb) => srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;

    const { abs, acos, acosh, asin, asinh, atan, atan2, atanh, cbrt, ceil, clz32, cos, cosh, exp, expm1, floor, fround, hypot, imul, log, log10, log1p, log2, max, min, pow, random, round, sign, sin, sinh, sqrt, tan, tanh, trunc, E, LN10, LN2, LOG10E, LOG2E, PI, SQRT1_2, SQRT2 } = Math;

    const range = function* (min, max, step = 1) {
        for (let number = min; number < max; number += step)
            yield number;
    };

    const extend = Object.assign;
    const overwrite = extend;

    const element = name => options => overwrite(document.createElement(name), options);
    const context2d = (options) => element('canvas')(options).getContext('2d');

    const renderer = (tmpl, arg = '$') => new Function(arg, 'return `' + tmpl + '`');
    const render = (tmpl, obj) => renderer(tmpl, '{' + Object.keys(obj) + '}')(obj);

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
                ...vert && { vert: render(vert, arg) },
                ...frag && { frag: render(frag, arg) }
            });
        }
    }

    const vert = "attribute vec2 aPosition;varying vec2 vPosition;void main(){vPosition=0.5+(0.5*aPosition);gl_Position=vec4(aPosition,0.,1.);}";
    class Setup extends Shader {
        constructor(regl) {
            super(regl, {
                vert,
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

    const frag = "#define MAP3(f,v) vec3(f(v.x),f(v.y),f(v.z))\n#define RGB(x) mix(x/12.92,pow((x+.055)/1.055,2.4),step(.04045,x))\n#define LUM(x) dot(x,vec3(.212655,.715158,.072187))\nprecision mediump float;uniform sampler2D uSrc;uniform float uBrightness;uniform float uGamma;uniform float uNoise;uniform float uTime;varying vec2 vPosition;float hash13(vec3 p3){p3=fract(p3*0.1031);p3+=dot(p3,p3.yzx+19.19);return fract((p3.x+p3.y)*p3.z);}void main(){vec3 srgb=texture2D(uSrc,vPosition).rgb;float signal=uBrightness*pow(LUM(MAP3(RGB,srgb)),uGamma);float noise=uNoise*(hash13(vec3(gl_FragCoord.xy,uTime))-0.5);gl_FragColor=vec4(signal+noise,0.,0.,0.);}";
    class Pass1 extends Shader {
        constructor(regl) {
            super(regl, {
                frag,
                framebuffer: regl.prop('dst'),
                uniforms: {
                    uSrc: regl.prop('src'),
                    uBrightness: regl.prop('brightness'),
                    uGamma: regl.prop('gamma'),
                    uNoise: regl.prop('noise'),
                    uTime: regl.context('time')
                }
            });
        }
    }

    const frag$1 = "#define TEX(s,size,uv,xy) texture2D(s,uv+(xy+.5)/size)\n#define O ${settings.optimized ? 1 : 0}\n#define U ${settings.lutWidth}\n#define V ${settings.lutHeight}\n#define X ${luts[0].length}\n#define Y ${luts.length}\nprecision mediump float;uniform sampler2D uSrc;uniform sampler2D uLut;uniform vec2 uSrcSize;uniform vec2 uLutSize;varying vec2 vPosition;void main(){float bestDelta=float(X);int bestChar=0;\n#if O\nfloat src[X];for(int v=0;v<V;v++)for(int u=0;u<U;u++)src[u+(v*U)]=TEX(uSrc,uSrcSize,vPosition,vec2(u,v)).r;for(int y=0;y<Y;y++){float delta=0.;for(int x=0;x<X;x++)delta+=abs(src[x]-TEX(uLut,uLutSize,0.,vec2(x,y)).r);if(delta<bestDelta){bestDelta=delta;bestChar=y;}}\n#else\nfor(int y=0;y<Y;y++){int x=0;float delta=0.;for(int v=0;v<V;v++)for(int u=0;u<U;u++)delta+=abs(TEX(uSrc,uSrcSize,vPosition,vec2(u,v)).r-TEX(uLut,uLutSize,0.,vec2(x++,y)).r);if(delta<bestDelta){bestDelta=delta;bestChar=y;}}\n#endif\ngl_FragColor=vec4(bestChar,0,0,0)/255.;}";
    class Pass2 extends Shader {
        constructor(regl) {
            super(regl, {
                frag: frag$1,
                framebuffer: regl.prop('dst'),
                context: {
                    src: regl.prop('src'),
                    lut: regl.prop('lut')
                },
                uniforms: {
                    uSrc: regl.context('src'),
                    uLut: regl.context('lut'),
                    uSrcSize: ({ src }) => [src.width, src.height],
                    uLutSize: ({ lut }) => [lut.width, lut.height]
                }
            });
        }
    }

    class Renderer {
        constructor(ascii) {
            this.ascii = ascii;
            this.context = context2d();
            this.canvas = this.context.canvas;
            this.bytes = new Uint8Array(1);
            const { regl } = ascii;
            this.src = regl.texture();
            this.lut = regl.texture();
            this.fbo1 = regl.framebuffer({ depthStencil: false, colorType: 'float' });
            this.fbo2 = regl.framebuffer({ depthStencil: false });
            this.setup = new Setup(regl);
            this.pass1 = new Pass1(regl);
            this.pass2 = new Pass2(regl);
        }
        resize(renderable, width, height) {
            const { context, canvas, ascii: { settings: { quality } } } = this;
            if (quality === 'low')
                return renderable;
            if (canvas.width !== width || canvas.height !== height) {
                overwrite(canvas, { width, height });
                context.imageSmoothingQuality = quality;
            }
            context.drawImage(renderable, 0, 0, width, height);
            return canvas;
        }
        update() {
            const { ascii } = this;
            this.lut({
                format: 'alpha',
                type: 'float',
                data: ascii.luts
            });
            this.setup.compile(ascii);
            this.pass1.compile(ascii);
            this.pass2.compile(ascii);
        }
        render(renderable, width, height) {
            const { src, lut, fbo1, fbo2, ascii: { regl, settings } } = this;
            const { brightness, gamma, noise } = settings;
            const w = settings.lutWidth * width;
            const h = settings.lutHeight * height;
            const length = width * height << 2;
            if (this.bytes.length !== length)
                this.bytes = new Uint8Array(length);
            src(this.resize(renderable, w, h));
            fbo1.resize(w, h);
            fbo2.resize(width, height);
            regl.poll();
            this.setup.command(() => {
                this.pass1.command({ dst: fbo1, src, brightness, gamma, noise });
                this.pass2.command({ dst: fbo2, src: fbo1, lut }, () => {
                    regl.draw();
                    regl.read(this.bytes);
                });
            });
            return this.bytes;
        }
    }

    class ASCIICoreSettings {
        constructor() {
            this.optimized = true;
            this.quality = 'high';
            this.fontFace = 'monospace';
            this.fontWidth = 40;
            this.fontHeight = 70;
            this.fontBlur = 6;
            this.lutWidth = 5;
            this.lutHeight = 7;
            this.lutPadding = 1;
            this.brightness = 1;
            this.gamma = 1;
            this.noise = 0;
        }
    }

    class ASCIISettings extends ASCIICoreSettings {
        get lutWidthPadded() { return this.lutPadding * 2 + this.lutWidth; }
        get lutHeightPadded() { return this.lutPadding * 2 + this.lutHeight; }
        get lutWidthRatio() { return this.lutWidthPadded / this.lutWidth; }
        get lutHeightRatio() { return this.lutHeightPadded / this.lutHeight; }
        get fontWidthPadded() { return round(this.lutWidthRatio * this.fontWidth); }
        get fontHeightPadded() { return round(this.lutHeightRatio * this.fontHeight); }
    }

    const msb = (n) => 1 << max(0, 31 - clz32(n));
    const fallback = (src, width, height) => {
        let w = msb(src.canvas.width / width - 1) * width;
        let h = msb(src.canvas.height / height - 1) * height;
        const tmp = context2d({ width: w, height: h });
        tmp.drawImage(src.canvas, 0, 0, w, h);
        for (let x, y; (x = w > width) || (y = h > height);)
            tmp.drawImage(tmp.canvas, 0, 0, w, h, 0, 0, w >>= x, h >>= y);
        const dst = context2d({ width, height });
        dst.drawImage(tmp.canvas, 0, 0);
        return dst;
    };
    const native = (src, width, height) => {
        const dst = context2d({ width, height });
        dst.imageSmoothingQuality = 'medium';
        dst.drawImage(src.canvas, 0, 0, width, height);
        return dst;
    };
    const downscale = 'imageSmoothingQuality' in CanvasRenderingContext2D.prototype
        ? native
        : fallback;

    class ASCII {
        constructor(REGL, settings) {
            this.settings = new ASCIISettings;
            this.charMap = Uint8Array.from(range(0x20, 0x7f));
            const canvas = element('canvas')();
            const extensions = ['OES_texture_float'];
            this.regl = REGL({ canvas, extensions });
            this.renderer = new Renderer(this);
            this.update(settings);
        }
        makeGlyph(charCode) {
            const { fontFace, fontBlur, fontWidth, fontHeight, fontWidthPadded, fontHeightPadded } = this.settings;
            const glyph = context2d({ width: fontWidthPadded, height: fontHeightPadded });
            const char = String.fromCharCode(charCode);
            glyph.fillStyle = '#00f';
            glyph.fillRect(0, 0, fontWidthPadded, fontHeightPadded);
            glyph.fillStyle = '#000';
            glyph.translate(fontWidthPadded / 2, fontHeightPadded / 2);
            glyph.fillRect(-fontWidth / 2, -fontHeight / 2, fontWidth, fontHeight);
            glyph.fillStyle = '#fff';
            glyph.textAlign = 'center';
            glyph.font = `${fontHeight}px ${fontFace}`;
            glyph.translate(0, fontHeight / 4);
            for (let i = 0; i < fontBlur;) {
                glyph.filter = `blur(${1 << i}px)`;
                glyph.globalAlpha = ++i / fontBlur;
                glyph.fillText(char, 0, 0);
            }
            return glyph;
        }
        makeLut(charCode) {
            const { lutWidth, lutHeight, lutPadding, lutWidthPadded, lutHeightPadded } = this.settings;
            const scaled = downscale(this.makeGlyph(charCode), lutWidthPadded, lutHeightPadded);
            const bytes = scaled.getImageData(lutPadding, lutPadding, lutWidth, lutHeight).data;
            const floats = new Float32Array(bytes.length >> 2);
            for (let i = 0; i < floats.length; i++)
                floats[i] = bytes[i << 2] / 0xff;
            return floats;
        }
        makeLuts() {
            const luts = Array.from(this.charMap, cc => this.makeLut(cc));
            const brightest = luts.reduce((m, lut) => max(m, max(...lut)), 0);
            luts.forEach(lut => lut.forEach((x, i) => lut[i] = rgb(x / brightest)));
            return luts;
        }
        update(settings) {
            overwrite(this.settings, settings);
            this.luts = this.makeLuts();
            this.renderer.update();
        }
        render(renderable, width, height) {
            const { renderer, charMap } = this;
            const bytes = renderer.render(renderable, width, height);
            let i = 0, j = 0;
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++)
                    bytes[i++] = charMap[bytes[j++ << 2]];
                bytes[i++] = 0xa;
            }
            const codes = bytes.subarray(0, i);
            const chars = String.fromCharCode(...codes);
            return chars;
        }
    }

    return ASCII;

})));
//# sourceMappingURL=ascii.js.map
