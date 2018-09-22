import { round } from 'wheels/esm/math';
import { ASCIICoreSettings } from './ASCIICoreSettings';
export class ASCIISettings extends ASCIICoreSettings {
    get lutWidthPadded() { return this.lutPadding * 2 + this.lutWidth; }
    get lutHeightPadded() { return this.lutPadding * 2 + this.lutHeight; }
    get lutWidthRatio() { return this.lutWidthPadded / this.lutWidth; }
    get lutHeightRatio() { return this.lutHeightPadded / this.lutHeight; }
    get fontWidthPadded() { return round(this.lutWidthRatio * this.fontWidth); }
    get fontHeightPadded() { return round(this.lutHeightRatio * this.fontHeight); }
}
