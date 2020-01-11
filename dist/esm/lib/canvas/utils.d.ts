import { Source } from '../../types';
export declare const extract: (src: Source) => HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | ImageBitmap;
export declare const convert: (src: Source) => CanvasRenderingContext2D;
export declare const clone: (src: Source) => CanvasRenderingContext2D;
export declare const measure: (src: Source) => number[] & {
    width: number;
    height: number;
    ratio: number;
};
export declare const context2d: (setup?: ((api: CanvasRenderingContext2D) => void) | undefined) => (attributes?: Partial<HTMLCanvasElement> | undefined) => CanvasRenderingContext2D;
//# sourceMappingURL=utils.d.ts.map