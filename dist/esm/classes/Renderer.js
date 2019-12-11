import { max, floor } from 'wheels/esm/math';
import { overwrite } from 'wheels/esm/object';
import { context2d } from 'wheels/esm/dom';
import { chr, monospaced } from '../utils';
import { Settings } from './Settings';
import { LUT } from './LUT';
export class Renderer {
    constructor(settings) {
        this.settings = new Settings;
        overwrite(this.settings, settings);
        this.api = context2d()();
        this.charMap = this.makeCharMap();
        this.luts = this.makeLUTs();
    }
    makeCharMap() {
        const { alphabet, fontFace } = this.settings;
        const charCodes = [...alphabet]
            .filter(monospaced(fontFace))
            .map(chr);
        return Uint16Array.from(charCodes);
    }
    makeLUTs() {
        const { charMap, settings } = this;
        const { lutMin, lutMax } = settings;
        const luts = Array.from(charMap, cc => LUT.fromCharCode(cc, settings));
        const maxʹ = luts.reduce((acc, lut) => max(acc, ...lut), 0);
        for (const lut of luts)
            lut.normalize(lutMin * maxʹ, lutMax * maxʹ);
        return luts;
    }
    resize(renderable, width, height) {
        const { api, settings } = this;
        overwrite(api.canvas, { width, height });
        api.imageSmoothingQuality = settings.quality;
        api.drawImage(renderable, 0, 0, width, height);
        return api;
    }
    render(renderable, width, height) {
        return [...this.lines(renderable, floor(width), floor(height))].join('\n');
    }
}
//# sourceMappingURL=Renderer.js.map