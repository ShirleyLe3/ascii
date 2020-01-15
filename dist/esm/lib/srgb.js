// https://en.wikipedia.org/wiki/SRGB
export const lum = (r, g, b) => 0.2126 /* r */ * r + 0.7152 /* g */ * g + 0.0722 /* b */ * b;
export const rgb = (srgb) => srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
export const srgb = (rgb) => rgb <= 0.0031308 ? rgb * 12.92 : (rgb ** (1 / 2.4)) * 1.055 - 0.055;
//# sourceMappingURL=srgb.js.map