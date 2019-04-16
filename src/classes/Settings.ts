import { round } from 'wheels/esm/math'
import { standard } from '../alphabets'

export class CoreSettings {
  alphabet   = standard
  quality    = 'high' as ImageSmoothingQuality
  fontFace   = 'monospace'
  fontWidth  = 40
  fontHeight = 70
  fontBlur   = 6
  lutWidth   = 5
  lutHeight  = 7
  lutPadding = 1
  brightness = 1
  gamma      = 1
  noise      = 0
}

export class Settings extends CoreSettings {
  get lutWidthPadded()   { return this.lutPadding*2 + this.lutWidth }
  get lutHeightPadded()  { return this.lutPadding*2 + this.lutHeight }
  get lutWidthRatio()    { return this.lutWidthPadded  / this.lutWidth }
  get lutHeightRatio()   { return this.lutHeightPadded / this.lutHeight }
  get fontWidthPadded()  { return round(this.lutWidthRatio  * this.fontWidth) }
  get fontHeightPadded() { return round(this.lutHeightRatio * this.fontHeight) }
}
