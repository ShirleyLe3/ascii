import { Settings, Source } from '../types';
import { Renderer } from './Renderer';
export declare class GPURenderer extends Renderer {
    private readonly _gl;
    private readonly _fbo;
    private readonly _txLUT;
    private readonly _txOdd;
    private readonly _txEven;
    private readonly _pass1;
    private readonly _pass2;
    private _charCodes;
    constructor(settings?: Partial<Settings>);
    protected _lines(src: Source, width: number, height: number): Generator<string, void, unknown>;
}
//# sourceMappingURL=GPURenderer.d.ts.map