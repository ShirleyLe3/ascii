import { lazyResizer } from "../lib/canvas/advanced.js";
import { context2d } from "../lib/canvas/utils.js";
import { floor, max } from "../lib/math.js";
import { chr } from "../lib/utils.js";
import { defaults } from "../settings.js";
import { LUT } from "./LUT.js";
export const monospaced = (font) => {
    const api = context2d(api => api.font = `1em ${font}`)(0, 0);
    const ref = api.measureText(' ');
    return (char) => api.measureText(char).width === ref.width;
};
export class Renderer {
    constructor(settings) {
        this._resize = lazyResizer();
        const settingsʹ = { ...defaults, ...settings };
        const { charSet, fontFamily, lutMin, lutMax } = settingsʹ;
        const codes = [...charSet].filter(monospaced(fontFamily)).map(chr);
        const luts = Array.from(codes, cc => LUT.fromCharCode(cc, settingsʹ));
        const maxʹ = luts.reduce((acc, lut) => max(acc, ...lut), 0);
        for (const lut of luts)
            lut.normalize(lutMin * maxʹ, lutMax * maxʹ);
        this.settings = settingsʹ;
        this._charMap = Uint32Array.from(codes);
        this._luts = luts;
    }
    render(src, width, height) {
        return [...this._lines(src, floor(width), floor(height))].join('\n');
    }
}
//# sourceMappingURL=Renderer.js.map