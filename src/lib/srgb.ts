// https://en.wikipedia.org/wiki/SRGB

export const enum Y {
  r = 0.2126,
  g = 0.7152,
  b = 0.0722
}

export const lum = (r: number, g: number, b: number) =>
  Y.r*r + Y.g*g + Y.b*b

export const rgb = (srgb: number) =>
  srgb<=0.04045 ? srgb/12.92 : ((srgb+0.055)/1.055)**2.4

export const srgb = (rgb: number) =>
  rgb<=0.0031308 ? rgb*12.92 : (rgb**(1/2.4))*1.055 - 0.055
