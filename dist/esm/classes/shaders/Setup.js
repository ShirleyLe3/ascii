import { Shader } from '../Shader';
import vert from 'glsl/setup.vert';
export class Setup extends Shader {
    constructor(regl) {
        super(regl, {
            vert,
            depth: {
                enable: false
            },
            attributes: {
                aPosition: [1, 1, -1, 1, 1, -1, -1, -1]
            },
            primitive: 'triangle strip',
            count: 4
        });
    }
}
