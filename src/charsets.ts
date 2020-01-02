/* eslint-disable prefer-template */
import { chr, str } from './utils'

const expand = (pair: string) => {
  const [a, b] = [...pair].map(chr)
  const codes = [...Array(b - a).keys()].map(n => a + n)
  return str(...codes)
}

export const ascii =
  expand(' ^') + expand('`~')

export const extended =
  ascii + expand('¡§') + expand('®±') + '©«¬´µ·»¿×÷'

export const unicode =
  extended + expand('‘•') + '‹›∙√∞'
