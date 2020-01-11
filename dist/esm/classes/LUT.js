import { rgb } from 'wheels/esm/color/srgb';
import { abs, round } from 'wheels/esm/math';
import { resizer } from '../lib/canvas/advanced';
import { context2d } from '../lib/canvas/utils';
import { str } from '../lib/utils';
const cached = context2d();
const resize = resizer();
export class LUT extends Float32Array {
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
        const api = cached({ width: fontWidthʹ, height: fontHeightʹ });
        const char = str(charCode);
        api.fillStyle = "#00f" /* outline */;
        api.fillRect(0, 0, fontWidthʹ, fontHeightʹ);
        api.translate(fontWidthʹ / 2, fontHeightʹ / 2);
        api.fillStyle = "#000" /* background */;
        api.fillRect(-fontWidth / 2, -fontHeight / 2, fontWidth, fontHeight);
        api.translate(0, fontHeight * (0.5 - fontBase));
        api.fillStyle = "#fff" /* foreground */;
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
//# sourceMappingURL=LUT.js.map