import { defaults } from './settings';
export declare type Settings = typeof defaults;
export declare type Context = OffscreenCanvasRenderingContext2D;
export declare type Source = Context | CanvasImageSource & TexImageSource;
export declare const Context: {
    new (): OffscreenCanvasRenderingContext2D;
    prototype: OffscreenCanvasRenderingContext2D;
};
//# sourceMappingURL=types.d.ts.map