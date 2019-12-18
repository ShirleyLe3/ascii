import { Source } from '../canvas';
import { LUT } from './LUT';
import { Settings } from './Settings';
export declare abstract class Renderer {
    protected readonly api: CanvasRenderingContext2D;
    protected readonly charMap: Uint16Array;
    protected readonly luts: LUT[];
    readonly settings: Settings;
    constructor(settings?: Partial<Settings>);
    private makeCharMap;
    private makeLUTs;
    render(src: Source, width: number, height: number): string;
    abstract lines(src: Source, width: number, height: number): IterableIterator<string>;
}
//# sourceMappingURL=Renderer.d.ts.map