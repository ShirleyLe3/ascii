import { Source } from '../../types';
export declare const extract: (src: Source) => HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | ImageBitmap | OffscreenCanvas | (SVGImageElement & ImageData);
export declare const measure: (src: Source) => number[] & {
    width: number;
    height: number;
    ratio: number;
};
export declare const context2d: (setup?: ((api: OffscreenCanvasRenderingContext2D) => void) | undefined) => (width: number, height: number) => OffscreenCanvasRenderingContext2D;
//# sourceMappingURL=utils.d.ts.map