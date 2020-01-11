import { Source } from '../../types';
export declare const converter: () => (src: Source) => OffscreenCanvasRenderingContext2D;
export declare const cropper: () => (src: Source, x: number, y: number, w: number, h: number) => OffscreenCanvasRenderingContext2D;
export declare const resizer: () => (src: Source, w: number, h: number) => OffscreenCanvasRenderingContext2D;
//# sourceMappingURL=basic.d.ts.map