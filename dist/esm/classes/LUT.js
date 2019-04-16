import { abs } from 'wheels/esm/math';
import { rgb } from 'wheels/esm/color/srgb';
import { context2d } from 'wheels/esm/dom';
import { downscale } from '../downscale';
import { str } from '../utils';
export class LUT extends Float32Array {
    constructor(width, height) {
        super(width * height);
        this.width = width;
        this.height = height;
    }
    static fromCharCode(charCode, settings) {
        const { fontFace, fontBlur, fontGamma } = settings;
        const { fontWidth, fontHeight, fontWidthPadded, fontHeightPadded } = settings;
        const { lutWidth, lutHeight, lutWidthPadded, lutHeightPadded, lutPadding } = settings;
        const api = context2d({ width: fontWidthPadded, height: fontHeightPadded })();
        const char = str(charCode);
        api.fillStyle = "#00f";
        api.fillRect(0, 0, fontWidthPadded, fontHeightPadded);
        api.translate(fontWidthPadded / 2, fontHeightPadded / 2);
        api.fillStyle = "#000";
        api.fillRect(-fontWidth / 2, -fontHeight / 2, fontWidth, fontHeight);
        api.translate(0, fontHeight / 4);
        api.fillStyle = "#fff";
        api.textAlign = 'center';
        api.font = `${fontHeight}px ${fontFace}`;
        for (let i = 0; i < fontBlur;) {
            api.filter = `blur(${1 << i}px)`;
            api.globalAlpha = (++i / fontBlur) ** fontGamma;
            api.fillText(char, 0, 0);
        }
        const scaled = downscale(api, lutWidthPadded, lutHeightPadded);
        const rgba = scaled.getImageData(lutPadding, lutPadding, lutWidth, lutHeight).data;
        const lut = new LUT(lutWidth, lutHeight);
        for (let i = 0; i < lut.length; i++)
            lut[i] = rgb(rgba[i << 2] / 0xff);
        return lut;
    }
    static combine(...luts) {
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
