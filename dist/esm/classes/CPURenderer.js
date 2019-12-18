import { rgb } from 'wheels/esm/color/srgb';
import { random } from 'wheels/esm/math';
import { resize } from '../canvas';
import { str } from '../utils';
import { Renderer } from './Renderer';
export class CPURenderer extends Renderer {
    *lines(src, width, height) {
        const { settings, charMap, luts } = this;
        const { lutWidth, lutHeight, brightness, gamma, noise } = settings;
        const srcWidth = lutWidth * width;
        const srcHeight = lutHeight * height;
        const srcʹ = resize(src, srcWidth, srcHeight);
        const rgba = srcʹ.getImageData(0, 0, srcWidth, srcHeight).data;
        const buffer = new Float32Array(lutWidth * lutHeight);
        for (let y = 0; y < srcHeight; y += lutHeight) {
            const codes = [];
            for (let x = 0; x < srcWidth; x += lutWidth) {
                let index = 0;
                let value = Infinity;
                for (let v = 0; v < lutHeight; v++) {
                    for (let u = 0; u < lutWidth; u++) {
                        let i = (x + u) + (y + v) * srcWidth << 2;
                        const r = 0.2126 /* r */ * rgb(rgba[i++] / 0xff);
                        const g = 0.7152 /* g */ * rgb(rgba[i++] / 0xff);
                        const b = 0.0722 /* b */ * rgb(rgba[i++] / 0xff);
                        const s = brightness * (r + g + b) ** gamma;
                        const n = noise * (random() - 0.5);
                        buffer[index++] = s + n; // signal + noise
                    }
                }
                for (let i = luts.length; i--;) {
                    const delta = luts[i].compare(buffer);
                    if (delta < value) {
                        value = delta;
                        index = i;
                    }
                }
                codes.push(charMap[index]);
            }
            yield str(...codes);
        }
    }
}
//# sourceMappingURL=CPURenderer.js.map