import { Settings } from '../types';
export declare class LUT extends Float32Array {
    readonly width: number;
    readonly height: number;
    constructor(width: number, height: number);
    static fromCharCode(charCode: number, settings: Settings): LUT;
    static combine(luts: LUT[]): LUT;
    normalize(min: number, max: number): void;
    compare(other: LUT): number;
}
//# sourceMappingURL=LUT.d.ts.map