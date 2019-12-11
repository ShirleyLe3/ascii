import { ascii } from '../alphabets';
export class Settings {
    constructor() {
        this.alphabet = ascii;
        this.quality = 'high';
        this.fontFace = 'monospace';
        this.fontWidth = 40;
        this.fontHeight = 70;
        this.fontBlur = 9;
        this.fontGamma = 1.0;
        this.lutWidth = 5;
        this.lutHeight = 7;
        this.lutPadding = 1;
        this.lutMin = 0.0;
        this.lutMax = 1.0;
        this.lutGamma = 1.0;
        this.brightness = 1.0;
        this.gamma = 1.0;
        this.noise = 0.0;
    }
}
//# sourceMappingURL=Settings.js.map