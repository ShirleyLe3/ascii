import { Source } from '../../types';
export declare const converter: () => (src: Source) => CanvasRenderingContext2D;
export declare const resizer: () => (src: Source, w: number, h: number) => CanvasRenderingContext2D;
export declare const cropper: () => (src: Source, w: number, h: number, x?: number, y?: number) => CanvasRenderingContext2D;
//# sourceMappingURL=basic.d.ts.map