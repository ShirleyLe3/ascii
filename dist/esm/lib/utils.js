/* eslint-disable @typescript-eslint/unbound-method */
export const str = String.fromCharCode;
export const chr = (str) => str.charCodeAt(0);
export const extend = Object.assign;
export const overwrite = extend;
export const copy = (object) => overwrite({}, object);
export const render = (str, ctx = {}, ref = '$') => new Function(`{${Object.keys(ctx)}}`, ref, `return \`${str}\``)(ctx, ctx);
//# sourceMappingURL=utils.js.map