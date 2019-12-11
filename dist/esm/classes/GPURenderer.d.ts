import { Renderer, Renderable } from './Renderer';
import { Settings } from './Settings';
export declare class GPURenderer extends Renderer {
    private readonly pass1;
    private readonly pass2;
    private readonly gl;
    private readonly fbo;
    private readonly txLUT;
    private readonly txOdd;
    private readonly txEven;
    private readonly lut;
    private indices;
    constructor(settings?: Partial<Settings>);
    lines(renderable: Renderable, width: number, height: number): Generator<string, void, unknown>;
}
//# sourceMappingURL=GPURenderer.d.ts.map