import { Source } from '../types';
import { LUT } from './LUT';
import { Settings } from './Settings';
export declare abstract class Renderer {
    protected readonly _charMap: Int32Array;
    protected readonly _luts: LUT[];
    readonly settings: Settings;
    constructor(settings?: Partial<Settings>);
    private _makeCharMap;
    private _makeLUTs;
    render(src: Source, width: number, height: number): string;
    abstract lines(src: Source, width: number, height: number): Generator<string>;
}
//# sourceMappingURL=Renderer.d.ts.map