import { Source } from '../canvas';
import { LUT } from './LUT';
import { Settings } from './Settings';
export declare abstract class Renderer {
    protected readonly charMap: Int32Array;
    protected readonly luts: LUT[];
    readonly settings: Settings;
    constructor(settings?: Partial<Settings>);
    private makeCharMap;
    private makeLUTs;
    render(src: Source, width: number, height: number): string;
    abstract lines(src: Source, width: number, height: number): Generator<string>;
}
//# sourceMappingURL=Renderer.d.ts.map