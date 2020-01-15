import { overwrite } from './utils'

type ElMap = HTMLElementTagNameMap
type ElNames = keyof HTMLElementTagNameMap
type Factory<T> = (...attrs: Partial<T>[]) => T
type Factoryʹ = <T extends ElNames>(name: T) => Factory<ElMap[T]>

export const element: Factoryʹ = name => (...attrs) =>
  overwrite(document.createElement(name), ...attrs)

export const canvas = element('canvas')
