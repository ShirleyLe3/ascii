import { Renderer, Renderable } from './Renderer';
export declare class SoftwareRenderer extends Renderer {
    lines(renderable: Renderable, width: number, height: number): IterableIterator<string>;
}
