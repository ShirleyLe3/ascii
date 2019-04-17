import { standard } from '../alphabets'

export class Settings {
  alphabet   = standard
  quality    = 'high' as ImageSmoothingQuality

  fontFace   = 'monospace'
  fontWidth  = 40
  fontHeight = 70
  fontBlur   = 6
  fontGamma  = 1

  lutWidth   = 5
  lutHeight  = 7
  lutPadding = 1

  brightness = 1.0
  gamma      = 1.0
  noise      = 0.0
}
