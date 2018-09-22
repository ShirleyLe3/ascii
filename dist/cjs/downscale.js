"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const math_1 = require("wheels/esm/math");
const dom_1 = require("wheels/esm/dom");
const msb = (n) => 1 << math_1.max(0, 31 - math_1.clz32(n));
const fallback = (src, width, height) => {
    let w = msb(src.canvas.width / width - 1) * width;
    let h = msb(src.canvas.height / height - 1) * height;
    const tmp = dom_1.context2d({ width: w, height: h });
    tmp.drawImage(src.canvas, 0, 0, w, h);
    for (let x, y; (x = w > width) || (y = h > height);)
        tmp.drawImage(tmp.canvas, 0, 0, w, h, 0, 0, w >>= x, h >>= y);
    const dst = dom_1.context2d({ width, height });
    dst.drawImage(tmp.canvas, 0, 0);
    return dst;
};
const native = (src, width, height) => {
    const dst = dom_1.context2d({ width, height });
    dst.imageSmoothingQuality = 'medium';
    dst.drawImage(src.canvas, 0, 0, width, height);
    return dst;
};
exports.downscale = 'imageSmoothingQuality' in CanvasRenderingContext2D.prototype
    ? native
    : fallback;
