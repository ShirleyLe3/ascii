"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Shader_1 = require("../Shader");
const frag = "#define TEX(s,size,uv,xy) texture2D(s,uv+(xy+.5)/size)\n#define MOD(x,y) (x-(x/y*y))\n#define false 0\n#define true 1\n#define O #{0.settings.optimized}\n#define U #{0.settings.lutWidth}\n#define V #{0.settings.lutHeight}\n#define X #{0.luts.0.length}\n#define Y #{0.luts.length}\nprecision mediump float;uniform sampler2D uSrc;uniform sampler2D uLut;uniform vec2 uSrcSize;uniform vec2 uLutSize;varying vec2 vPosition;void main(){float bestDelta=3.402823e+38;int bestChar=0;\n#if O\nfloat deltas[Y];for(int x=0;x<X;x++){int u=MOD(x,U),v=x/U;float a=TEX(uSrc,uSrcSize,vPosition,vec2(u,v)).r;for(int y=0;y<Y;y++){float b=TEX(uLut,uLutSize,0.,vec2(x,y)).r;deltas[y]+=abs(a-b);}}for(int y=0;y<Y;y++){float delta=deltas[y];if(delta<bestDelta){bestDelta=delta;bestChar=y;}}\n#else\nfor(int y=0;y<Y;y++){int x=0;float delta=0.;for(int v=0;v<V;v++){for(int u=0;u<U;u++){float a=TEX(uSrc,uSrcSize,vPosition,vec2(u,v)).r;float b=TEX(uLut,uLutSize,0.,vec2(x++,y)).r;delta+=abs(a-b);}}if(delta<bestDelta){bestDelta=delta;bestChar=y;}}\n#endif\ngl_FragColor=vec4(bestChar,0,0,0)/255.;}";
class Pass2 extends Shader_1.Shader {
    constructor(regl) {
        super(regl, {
            frag: pass2_frag_1.default,
            framebuffer: regl.prop('dst'),
            context: {
                src: regl.prop('src'),
                lut: regl.prop('lut')
            },
            uniforms: {
                uSrc: regl.context('src'),
                uLut: regl.context('lut'),
                uSrcSize: ({ src }) => [src.width, src.height],
                uLutSize: ({ lut }) => [lut.width, lut.height]
            }
        });
    }
}
exports.Pass2 = Pass2;
