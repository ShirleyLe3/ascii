import { context2d } from 'wheels/esm/dom';
import { floor, max } from 'wheels/esm/math';
import { overwrite } from 'wheels/esm/object';
import { chr, monospaced } from '../utils';
import { fromCharCode } from './LUT';
import { Settings } from './Settings';
export class Renderer {
    constructor(settings) {
        this.settings = new Settings;
        overwrite(this.settings, settings);
        this.api = context2d()();
        this.charMap = this.makeCharMap();
        this.luts = this.makeLUTs();
    }
    makeCharMap() {
        const { charSet, fontFamily } = this.settings;
        const charCodes = [...charSet]
            .filter(monospaced(fontFamily))
            .map(chr);
        return Uint16Array.from(charCodes);
    }
    makeLUTs() {
        const { charMap, settings } = this;
        const { lutMin, lutMax } = settings;
        const luts = Array.from(charMap, cc => fromCharCode(cc, settings));
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