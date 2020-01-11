import { Settings, Source } from '../types';
import { LUT } from './LUT';
export declare const monospaced: (font: string) => (char: string) => boolean;
export declare abstract class Renderer {
    readonly settings: Settings;
    protected readonly _charMap: Int32Array;
    protected readonly _luts: LUT[];
    protected readonly _resize: (src: Source, w: number, h: number) => Source;
    constructor(settings?: Partial<Settings>);
    private _makeCharMap;
    private _makeLUTs;
    render(src: Source, width: number, height: number): string;
    abstract lines(src: Source, width: number, height: number): Generator<string>;
}
//# sourceMappingURL=Renderer.d.ts.map