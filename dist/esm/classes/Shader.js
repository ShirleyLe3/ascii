import { render } from 'wheels/esm/text/template';
export class Shader {
    constructor(regl, binds) {
        this.regl = regl;
        this.binds = binds;
    }
    compile(arg) {
        const { regl, binds } = this;
        const { vert, frag } = binds;
        this.command = regl({
            ...binds,
            ...vert && { vert: render(vert, arg) },
            ...frag && { frag: render(frag, arg) }
        });
    }
}
