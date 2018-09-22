import { Renderer, Renderable } from './Renderer';
import { ASCIICoreSettings } from './ASCIICoreSettings';
import { ASCIISettings } from './ASCIISettings';
export declare class ASCII {
    regl: any;
    luts: Float32Array[];
    renderer: Renderer;
    settings: ASCIISettings;
    charMap: Uint8Array;
    constructor(REGL: any, settings?: Partial<ASCIICoreSettings>);
    private makeGlyph;
    private makeLut;
    private makeLuts;
    update(settings?: Partial<ASCIICoreSettings>): void;
    render(renderable: Renderable, width: number, height: number): string;
}
