import { Shader } from '../Shader';
const frag = "#define TEX(s,size,uv,xy) texture2D(s,uv+(xy+.5)/size)\n#define MOD(x,y) (x-(x/y*y))\n#define O ${settings.optimized ? 1 : 0}\n#define U ${settings.lutWidth}\n#define V ${settings.lutHeight}\n#define X ${luts[0].length}\n#define Y ${luts.length}\nprecision mediump float;uniform sampler2D uSrc;uniform sampler2D uLut;uniform vec2 uSrcSize;uniform vec2 uLutSize;varying vec2 vPosition;void main(){float bestDelta=3.402823e+38;int bestChar=0;\n#if O\nfloat src[X];for(int v=0;v<V;v++){for(int u=0;u<U;u++){src[u+(v*U)]=TEX(uSrc,uSrcSize,vPosition,vec2(u,v)).r;}}for(int y=0;y<Y;y++){float delta=0.;for(int x=0;x<X;x++){float a=src[x];float b=TEX(uLut,uLutSize,0.,vec2(x,y)).r;delta+=abs(a-b);}if(delta<bestDelta){bestDelta=delta;bestChar=y;}}\n#else\nfor(int y=0;y<Y;y++){int x=0;float delta=0.;for(int v=0;v<V;v++){for(int u=0;u<U;u++){float a=TEX(uSrc,uSrcSize,vPosition,vec2(u,v)).r;float b=TEX(uLut,uLutSize,0.,vec2(x++,y)).r;delta+=abs(a-b);}}if(delta<bestDelta){bestDelta=delta;bestChar=y;}}\n#endif\ngl_FragColor=vec4(bestChar,0,0,0)/255.;}";
export class Pass2 extends Shader {
    constructor(regl) {
        super(regl, {
            frag,
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
