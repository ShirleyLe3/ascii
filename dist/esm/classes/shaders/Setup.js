import { Shader } from '../Shader';
const vert = "attribute vec2 aPosition;varying vec2 vPosition;void main(){vPosition=0.5+(0.5*aPosition);gl_Position=vec4(aPosition,0.,1.);}";
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
