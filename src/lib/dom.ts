import { overwrite } from './utils'

export const element = <K extends keyof HTMLElementTagNameMap>(name: K) =>
  (...attributes: Partial<HTMLElementTagNameMap[K]>[]) =>
    overwrite(document.createElement(name), ...attributes)

export const canvas = element('canvas')
