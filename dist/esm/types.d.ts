import { defaults } from './settings';
export declare type Settings = typeof defaults;
export declare type Context = CanvasRenderingContext2D;
export declare type Source = Context | CanvasImageSource & TexImageSource;
export declare const Context: {
    new (): CanvasRenderingContext2D;
    prototype: CanvasRenderingContext2D;
};
//# sourceMappingURL=types.d.ts.map