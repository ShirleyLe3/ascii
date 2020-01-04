import { context2d } from 'wheels/esm/dom';
export const extract = (src) => src instanceof CanvasRenderingContext2D
    ? src.canvas
    : src;
export const convert = (src) => {
    if (src instanceof CanvasRenderingContext2D)
        return src;
    const { width, height } = src;
    const api = context2d({ width, height })();
    api.drawImage(src, 0, 0);
    return api;
};
//# sourceMappingURL=utils.js.map