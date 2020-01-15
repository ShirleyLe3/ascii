/* eslint-disable @typescript-eslint/unbound-method */

export const str = String.fromCharCode
export const chr = (str: string) => str.charCodeAt(0)

export const extend: typeof Object.assign = Object.assign
export const overwrite: <T>(target: T, ...sources: Partial<T>[]) => T = extend
export const copy = <T>(object: T) => overwrite({} as T, object)

export const render = (str: string, ctx = {}, ref = '$'): string =>
  new Function(`{${Object.keys(ctx)}}`, ref, `return \`${str}\``)(ctx, ctx)
