import { Settings } from './Settings';
export declare class LUT extends Float32Array {
    width: number;
    height: number;
    static fromCharCode(charCode: number, settings: Settings): LUT;
    static combine(...luts: LUT[]): LUT;
    constructor(width: number, height: number);
    normalize(min: number, max: number): void;
    compare(other: ArrayLike<number>): number;
}
//# sourceMappingURL=LUT.d.ts.map