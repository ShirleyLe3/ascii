import { floor, max } from 'wheels/esm/math';
import { lazyResizer } from '../lib/canvas/advanced';
import { context2d } from '../lib/canvas/utils';
import { chr } from '../lib/utils';
import { defaults } from '../settings';
import { LUT } from './LUT';
export const monospaced = (font) => {
    const api = context2d(api => api.font = `1em ${font}`)();
    const ref = api.measureText(' ');
    return (char) => api.measureText(char).width === ref.width;
};
export class Renderer {
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
        return [...this.lines(src, floor(width), floor(height))].join('\n');
    }
}
//# sourceMappingURL=Renderer.js.map