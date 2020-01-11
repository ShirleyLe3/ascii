import { rgb } from 'wheels/esm/color/srgb';
import { random } from 'wheels/esm/math';
import { convert } from '../lib/canvas/utils';
import { str } from '../lib/utils';
import { LUT } from './LUT';
import { Renderer } from './Renderer';
export class CPURenderer extends Renderer {
    *lines(src, width, height) {
        const { settings, _charMap, _luts, _resize } = this;
        const { lutWidth, lutHeight, brightness, gamma, noise } = settings;
        const srcWidth = lutWidth * width;
        const srcHeight = lutHeight * height;
        const srcʹ = convert(_resize(src, srcWidth, srcHeight));
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
                        const r = 0.2126 /* r */ * rgb(rgba[i++] / 0xff);
                        const g = 0.7152 /* g */ * rgb(rgba[i++] / 0xff);
                        const b = 0.0722 /* b */ * rgb(rgba[i++] / 0xff);
                        const s = brightness * (r + g + b) ** gamma;
                        const n = noise * (random() - 0.5);
                        buffer[index++] = s + n; // signal + noise
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
//# sourceMappingURL=CPURenderer.js.map