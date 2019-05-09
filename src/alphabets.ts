import { rangeʹ as range } from 'it/dist/esm'
import { str } from './utils'

const alphabet = str(
  // ascii
  ...range(0x20, 0x5f), // _!"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^
  ...range(0x60, 0x7f), // `abcdefghijklmnopqrstuvwxyz{|}~

  // extended ascii
  ...range(0xa1, 0xa8), // ¡¢£¤¥¦§
  ...range(0xae, 0xb2), // ®¯°±
  0xa9, 0xab, 0xac, 0xb4, 0xb5, 0xb7, 0xbb, 0xbf, 0xd7, 0xf7, // ©«¬´µ·»¿×÷

  // unicode
  ...range(0x2018, 0x2023), // ‘’‚‛“”„‟†‡•
  0x2039, 0x203a, 0x2219, 0x221a, 0x221e // ‹›∙√∞
)

export const ascii    = alphabet.replace(/[^\x00-\x7f]/g, '')
export const extended = alphabet.replace(/[^\x00-\xff]/g, '')
export const unicode  = alphabet
