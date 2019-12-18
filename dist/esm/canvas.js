import { context2d } from 'wheels/esm/dom';
import { clz32, max } from 'wheels/esm/math';
// most significant bit (but msb(x) is always >=1)
const msb = (n) => 1 << max(0, 31 - clz32(n));
export const extract = (src) => src instanceof CanvasRenderingContext2D
    ? src.canvas
    : src;
export const resize = (src, w, h) => {
    const srcʹ = extract(src);
    let wʹ = w * msb(srcʹ.width / w - 1);
    let hʹ = h * msb(srcʹ.height / h - 1);
    const tmp = context2d({ width: wʹ, height: hʹ })();
    tmp.drawImage(srcʹ, 0, 0, wʹ, hʹ);
    if (w === wʹ && h === hʹ)
        return tmp;
    for (let x, y; x = wʹ > w, y = hʹ > h, x || y;)
        tmp.drawImage(tmp.canvas, 0, 0, wʹ, hʹ, 0, 0, wʹ >>= +x, hʹ >>= +y);
    const dst = context2d({ width: w, height: h })();
    dst.drawImage(tmp.canvas, 0, 0);
    return dst;
};
//# sourceMappingURL=canvas.js.map