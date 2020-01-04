import { context2d } from 'wheels/esm/dom';
import { extract } from './utils';
export const crop = (src, x, y, w, h) => {
    const dst = context2d({ width: w, height: h })();
    dst.drawImage(extract(src), x, y, w, h, 0, 0, w, h);
    return dst;
};
export const resize = (src, w, h) => {
    const dst = context2d({ width: w, height: h })();
    dst.drawImage(extract(src), 0, 0, w, h);
    return dst;
};
//# sourceMappingURL=basic.js.map