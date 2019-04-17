import { Settings } from './Settings';
import { LUT } from './LUT';
export declare type Renderable = HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap;
export declare abstract class Renderer {
    protected readonly api: CanvasRenderingContext2D;
    protected readonly charMap: Uint16Array;
    protected readonly luts: LUT[];
    readonly settings: Settings;
    constructor(settings?: Partial<Settings>);
    private makeCharMap;
    private makeLUTs;
    protected resize(renderable: Renderable, width: number, height: number): CanvasRenderingContext2D;
    render(renderable: Renderable, width: number, height: number): string;
    abstract lines(renderable: Renderable, width: number, height: number): IterableIterator<string>;
}
