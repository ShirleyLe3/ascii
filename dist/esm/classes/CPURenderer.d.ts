import { Source } from '../types';
import { Renderer } from './Renderer';
export declare class CPURenderer extends Renderer {
    private readonly _convert;
    protected _lines(src: Source, width: number, height: number): Generator<string, void, unknown>;
}
//# sourceMappingURL=CPURenderer.d.ts.map