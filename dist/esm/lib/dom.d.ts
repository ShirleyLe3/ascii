declare type ElMap = HTMLElementTagNameMap;
declare type ElNames = keyof HTMLElementTagNameMap;
declare type Factory<T> = (...attrs: Partial<T>[]) => T;
declare type Factoryʹ = <T extends ElNames>(name: T) => Factory<ElMap[T]>;
export declare const element: Factoryʹ;
export declare const canvas: Factory<HTMLCanvasElement>;
export {};
//# sourceMappingURL=dom.d.ts.map