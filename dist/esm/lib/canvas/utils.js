import { Context } from "../../types.js";
import { canvas } from "../dom.js";
import { extend, overwrite } from "../utils.js";
const triplet = (w, h) => extend([w, h, w / h], { width: w, height: h, ratio: w / h });
export const extract = (src) => src instanceof Context
    ? src.canvas
    : src;
export const measure = (src) => {
    if (src instanceof HTMLVideoElement)
        return triplet(src.videoWidth, src.videoHeight);
    if (src instanceof HTMLImageElement)
        return triplet(src.naturalWidth, src.naturalHeight);
    const srcʹ = extract(src);
    return triplet(srcʹ.width, srcʹ.height);
};
export const context2d = (setup) => {
    const context = canvas().getContext('2d');
    return (width, height) => {
        var _a;
        overwrite(context.canvas, { width, height });
        (_a = setup) === null || _a === void 0 ? void 0 : _a(context);
        return context;
    };
};
//# sourceMappingURL=utils.js.map