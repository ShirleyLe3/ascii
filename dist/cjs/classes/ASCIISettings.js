"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const math_1 = require("wheels/esm/math");
const ASCIICoreSettings_1 = require("./ASCIICoreSettings");
class ASCIISettings extends ASCIICoreSettings_1.ASCIICoreSettings {
    get lutWidthPadded() { return this.lutPadding * 2 + this.lutWidth; }
    get lutHeightPadded() { return this.lutPadding * 2 + this.lutHeight; }
    get lutWidthRatio() { return this.lutWidthPadded / this.lutWidth; }
    get lutHeightRatio() { return this.lutHeightPadded / this.lutHeight; }
    get fontWidthPadded() { return math_1.round(this.lutWidthRatio * this.fontWidth); }
    get fontHeightPadded() { return math_1.round(this.lutHeightRatio * this.fontHeight); }
}
exports.ASCIISettings = ASCIISettings;
