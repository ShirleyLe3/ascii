import { round } from 'wheels/esm/math';
import { standard } from '../alphabets';
export class CoreSettings {
    constructor() {
        this.alphabet = standard;
        this.quality = 'high';
        this.fontFace = 'monospace';
        this.fontWidth = 40;
        this.fontHeight = 70;
        this.fontBlur = 6;
        this.fontGamma = 1;
        this.lutWidth = 5;
        this.lutHeight = 7;
        this.lutPadding = 1;
        this.brightness = 1;
        this.gamma = 1;
        this.noise = 0;
    }
}
export class Settings extends CoreSettings {
    get lutWidthPadded() { return this.lutPadding * 2 + this.lutWidth; }
    get lutHeightPadded() { return this.lutPadding * 2 + this.lutHeight; }
    get lutWidthRatio() { return this.lutWidthPadded / this.lutWidth; }
    get lutHeightRatio() { return this.lutHeightPadded / this.lutHeight; }
    get fontWidthPadded() { return round(this.lutWidthRatio * this.fontWidth); }
    get fontHeightPadded() { return round(this.lutHeightRatio * this.fontHeight); }
}
