import { element } from 'wheels/esm/dom';
import { extend, overwrite } from 'wheels/esm/object';
const triplet = (w, h) => extend([w, h, w / h], { width: w, height: h, ratio: w / h });
export const extract = (src) => src instanceof CanvasRenderingContext2D ? src.canvas : src;
export const convert = (src) => src instanceof CanvasRenderingContext2D ? src : clone(src);
export const clone = (src) => {
    const dst = context2d()(measure(src));
    dst.drawImage(extract(src), 0, 0);
    return dst;
};
export const measure = (src) => {
    if (src instanceof HTMLVideoElement)
        return triplet(src.videoWidth, src.videoHeight);
    if (src instanceof HTMLImageElement)
        return triplet(src.naturalWidth, src.naturalHeight);
    const srcʹ = extract(src);
    return triplet(srcʹ.width, srcʹ.height);
};
export const context2d = (setup) => {
    const canvas = element('canvas')();
    const context = canvas.getContext('2d');
    return (attributes) => {
        var _a;
        overwrite(canvas, attributes);
        (_a = setup) === null || _a === void 0 ? void 0 : _a(context);
        return context;
    };
};
//# sourceMappingURL=utils.js.map