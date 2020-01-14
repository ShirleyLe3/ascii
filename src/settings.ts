import { ascii } from './charsets'

export const defaults = {
  charSet:    ascii,

  fontFamily: 'monospace',
  fontBase:   0.25,
  fontWidth:  40,
  fontHeight: 70,
  fontBlur:   9,
  fontGamma:  1.0,

  lutWidth:   5,
  lutHeight:  7,
  lutPadding: 1,
  lutMin:     0.0,
  lutMax:     1.0,
  lutGamma:   1.0,

  gamma:      1.0,
  signal:     1.0,
  noise:      0.0
}
