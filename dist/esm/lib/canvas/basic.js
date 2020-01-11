import { context2d, extract } from './utils';
export const cropper = () => {
    const cached = context2d();
    return (src, x, y, w, h) => {
        const dst = cached({ width: w, height: h });
        dst.drawImage(extract(src), x, y, w, h, 0, 0, w, h);
        return dst;
    };
};
export const resizer = () => {
    const cached = context2d();
    return (src, w, h) => {
        const dst = cached({ width: w, height: h });
        dst.drawImage(extract(src), 0, 0, w, h);
        return dst;
    };
};
//# sourceMappingURL=basic.js.map