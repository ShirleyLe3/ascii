import { context2d, extract, measure } from "./utils.js";
export const converter = () => {
    const cached = context2d();
    return (src) => {
        const [w, h] = measure(src);
        const dst = cached(w, h);
        dst.drawImage(extract(src), 0, 0);
        return dst;
    };
};
export const resizer = () => {
    const cached = context2d();
    return (src, w, h) => {
        const dst = cached(w, h);
        dst.drawImage(extract(src), 0, 0, w, h);
        return dst;
    };
};
export const cropper = () => {
    const cached = context2d();
    return (src, w, h, x = 0, y = 0) => {
        const dst = cached(w, h);
        dst.drawImage(extract(src), x, y, w, h, 0, 0, w, h);
        return dst;
    };
};
//# sourceMappingURL=basic.js.map