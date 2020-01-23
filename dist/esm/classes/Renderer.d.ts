import { Settings, Source } from '../types';
import { LUT } from './LUT';
export declare const monospaced: (font: string) => (char: string) => boolean;
export declare abstract class Renderer {
    readonly settings: Settings;
    protected readonly _charMap: Uint32Array;
    protected readonly _luts: LUT[];
    protected readonly _resize: (src: Source, w: number, h: number) => HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | ImageBitmap | OffscreenCanvas | CanvasRenderingContext2D | (SVGImageElement & ImageData);
    constructor(settings?: Partial<Settings>);
    render(src: Source, width: number, height: number): string;
    protected abstract _lines(src: Source, width: number, height: number): Generator<string>;
}
//# sourceMappingURL=Renderer.d.ts.map