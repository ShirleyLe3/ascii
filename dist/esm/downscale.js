import { max, clz32 } from 'wheels/esm/math';
import { context2d } from 'wheels/esm/dom';
const msb = (n) => 1 << max(0, 31 - clz32(n));
const fallback = (src, width, height) => {
    let w = msb(src.canvas.width / width - 1) * width;
    let h = msb(src.canvas.height / height - 1) * height;
    const tmp = context2d({ width: w, height: h })();
    tmp.drawImage(src.canvas, 0, 0, w, h);
    for (let x, y; (x = w > width) || (y = h > height);)
        tmp.drawImage(tmp.canvas, 0, 0, w, h, 0, 0, w >>= x, h >>= y);
    const dst = context2d({ width, height })();
    dst.drawImage(tmp.canvas, 0, 0);
    return dst;
};
const native = (src, width, height) => {
    const dst = context2d({ width, height })({ imageSmoothingQuality: 'medium' });
    dst.drawImage(src.canvas, 0, 0, width, height);
    return dst;
};
export const downscale = 'imageSmoothingQuality' in CanvasRenderingContext2D.prototype
    ? native
    : fallback;
