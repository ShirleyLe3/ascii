/* eslint-disable @typescript-eslint/unbound-method */
import { context2d } from 'wheels/esm/dom';
export const str = String.fromCharCode;
export const chr = (str) => str.charCodeAt(0);
export const render = (str, ctx = {}, ref = '$') => new Function(`{${Object.keys(ctx)}}`, ref, `return \`${str}\``)(ctx, ctx);
// chars.filter(monospaced(font))
export const monospaced = (font) => {
    const api = context2d()({ font: `1em ${font}` });
    const ref = api.measureText(' ');
    return (char) => api.measureText(char).width === ref.width;
};
//# sourceMappingURL=utils.js.map