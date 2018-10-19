"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const srgb_1 = require("wheels/esm/color/srgb");
const math_1 = require("wheels/esm/math");
const fp_1 = require("wheels/esm/fp");
const object_1 = require("wheels/esm/object");
const dom_1 = require("wheels/esm/dom");
const Renderer_1 = require("./Renderer");
const ASCIISettings_1 = require("./ASCIISettings");
const downscale_1 = require("../downscale");
const charCodes = function* () {
    yield* fp_1.range(0x20, 0x5f);
    yield* fp_1.range(0x60, 0x7f);
    yield* fp_1.range(0xa1, 0xa8);
    yield* fp_1.range(0xa9, 0xad);
    yield* fp_1.range(0xae, 0xb6);
    yield* fp_1.range(0xb7, 0xc0);
    yield* [0xd7, 0xf7];
    yield* fp_1.range(0x2018, 0x2023);
    yield* fp_1.range(0x2039, 0x203b);
    yield* fp_1.range(0x2070, 0x20a0);
    yield* fp_1.range(0x2219, 0x221b);
    yield* [0x2043, 0x221e];
};
class ASCII {
    constructor(REGL, settings) {
        this.settings = new ASCIISettings_1.ASCIISettings;
        this.charMap = new Uint16Array(this.filter(charCodes()));
        const canvas = dom_1.element('canvas')();
        const extensions = ['OES_texture_float'];
        this.regl = REGL({ canvas, extensions });
        this.renderer = new Renderer_1.Renderer(this);
        this.update(settings);
    }
    makeGlyph(charCode) {
        const { fontFace, fontBlur, fontWidth, fontHeight, fontWidthPadded, fontHeightPadded } = this.settings;
        const glyph = dom_1.context2d({ width: fontWidthPadded, height: fontHeightPadded });
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
        const scaled = downscale_1.downscale(this.makeGlyph(charCode), lutWidthPadded, lutHeightPadded);
        const bytes = scaled.getImageData(lutPadding, lutPadding, lutWidth, lutHeight).data;
        const floats = new Float32Array(bytes.length >> 2);
        for (let i = 0; i < floats.length; i++)
            floats[i] = bytes[i << 2] / 0xff;
        return floats;
    }
    makeLuts() {
        const luts = Array.from(this.charMap, cc => this.makeLut(cc));
        const brightest = luts.reduce((m, lut) => math_1.max(m, ...lut), 0);
        for (const lut of luts)
            for (let i = 0; i < lut.length; i++)
                lut[i] = srgb_1.rgb(lut[i] / brightest);
        return luts;
    }
    *filter(charCodes) {
        const api = dom_1.context2d();
        api.font = `1em ${this.settings.fontFace}`;
        const ref = api.measureText(' ');
        for (const cc of charCodes)
            if (api.measureText(String.fromCharCode(cc)).width === ref.width)
                yield cc;
    }
    *map(rgba, width, height) {
        const { charMap } = this;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++)
                yield charMap[rgba[x + y * width << 2]];
            yield 0xa;
        }
    }
    update(settings) {
        object_1.overwrite(this.settings, settings);
        this.luts = this.makeLuts();
        this.renderer.update();
    }
    render(renderable, width, height) {
        const widthʹ = math_1.floor(width), heightʹ = math_1.floor(height);
        const rgba = this.renderer.render(renderable, widthʹ, heightʹ);
        const chars = String.fromCharCode(...this.map(rgba, widthʹ, heightʹ));
        return chars;
    }
}
exports.ASCII = ASCII;
