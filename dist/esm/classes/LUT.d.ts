import { Settings } from './Settings';
export declare const fromCharCode: (charCode: number, settings: Settings) => LUT;
export declare const combine: (luts: LUT[]) => LUT;
export declare class LUT extends Float32Array {
    width: number;
    height: number;
    constructor(width: number, height: number);
    normalize(min: number, max: number): void;
    compare(other: ArrayLike<number>): number;
}
//# sourceMappingURL=LUT.d.ts.map