import { ASCII } from './ASCII';
export declare type Renderable = HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap;
export declare class Renderer {
    private readonly ascii;
    private readonly src;
    private readonly lut;
    private readonly fbo1;
    private readonly fbo2;
    private readonly setup;
    private readonly pass1;
    private readonly pass2;
    private bytes;
    constructor(ascii: ASCII);
    update(): void;
    render(renderable: Renderable, width: number, height: number): Uint8Array;
}
