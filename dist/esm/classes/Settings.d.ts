export declare class CoreSettings {
    alphabet: string;
    quality: ImageSmoothingQuality;
    fontFace: string;
    fontWidth: number;
    fontHeight: number;
    fontBlur: number;
    fontGamma: number;
    lutWidth: number;
    lutHeight: number;
    lutPadding: number;
    brightness: number;
    gamma: number;
    noise: number;
}
export declare class Settings extends CoreSettings {
    readonly lutWidthPadded: number;
    readonly lutHeightPadded: number;
    readonly lutWidthRatio: number;
    readonly lutHeightRatio: number;
    readonly fontWidthPadded: number;
    readonly fontHeightPadded: number;
}
