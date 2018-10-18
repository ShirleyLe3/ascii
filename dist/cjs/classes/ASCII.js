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
class ASCII {
    constructor(REGL, settings) {
        this.settings = new ASCIISettings_1.ASCIISettings;
        this.charMap = Uint8Array.from(fp_1.range(0x20, 0x7f));
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
    update(settings) {
        object_1.overwrite(this.settings, settings);
        this.luts = this.makeLuts();
        this.renderer.update();
    }
    render(renderable, width, height) {
        const { renderer, charMap } = this;
        const widthʹ = math_1.floor(width);
        const heightʹ = math_1.floor(height);
        const bytes = renderer.render(renderable, widthʹ, heightʹ);
        let i = 0, j = 0;
        for (let y = 0; y < heightʹ; y++) {
            for (let x = 0; x < widthʹ; x++)
                bytes[i++] = charMap[bytes[j++ << 2]];
            bytes[i++] = 0xa;
        }
        const codes = bytes.subarray(0, i);
        const chars = String.fromCharCode(...codes);
        return chars;
    }
}
exports.ASCII = ASCII;
