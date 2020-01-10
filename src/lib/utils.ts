/* eslint-disable @typescript-eslint/unbound-method */

export const str = String.fromCharCode
export const chr = (str: string) => str.charCodeAt(0)

export const render = (str: string, ctx = {}, ref = '$'): string =>
  new Function(`{${Object.keys(ctx)}}`, ref, `return \`${str}\``)(ctx, ctx)
