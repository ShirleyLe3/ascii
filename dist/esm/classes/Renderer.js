import { overwrite } from 'wheels/esm/object';
import { context2d } from 'wheels/esm/dom';
import { Setup } from './shaders/Setup';
import { Pass1 } from './shaders/Pass1';
import { Pass2 } from './shaders/Pass2';
export class Renderer {
    constructor(ascii) {
        this.ascii = ascii;
        this.context = context2d();
        this.canvas = this.context.canvas;
        this.rgba = new Float32Array(1);
        const { regl } = ascii;
        this.src = regl.texture();
        this.lut = regl.texture();
        this.fbo1 = regl.framebuffer({ depthStencil: false, colorType: 'float' });
        this.fbo2 = regl.framebuffer({ depthStencil: false, colorType: 'float' });
        this.setup = new Setup(regl);
        this.pass1 = new Pass1(regl);
        this.pass2 = new Pass2(regl);
    }
    resize(renderable, width, height) {
        const { context, canvas, ascii: { settings: { quality } } } = this;
        if (quality === 'low')
            return renderable;
        if (canvas.width !== width || canvas.height !== height) {
            overwrite(canvas, { width, height });
            context.imageSmoothingQuality = quality;
        }
        context.drawImage(renderable, 0, 0, width, height);
        return canvas;
    }
    update() {
        const { ascii } = this;
        this.lut({
            format: 'alpha',
            type: 'float',
            data: ascii.luts
        });
        this.setup.compile(ascii);
        this.pass1.compile(ascii);
        this.pass2.compile(ascii);
    }
    render(renderable, width, height) {
        const { src, lut, fbo1, fbo2, ascii: { regl, settings } } = this;
        const { brightness, gamma, noise } = settings;
        const w = settings.lutWidth * width;
        const h = settings.lutHeight * height;
        const length = width * height << 2;
        if (this.rgba.length !== length)
            this.rgba = new Float32Array(length);
        src(this.resize(renderable, w, h));
        fbo1.resize(w, h);
        fbo2.resize(width, height);
        regl.poll();
        this.setup.command(() => {
            this.pass1.command({ dst: fbo1, src, brightness, gamma, noise });
            this.pass2.command({ dst: fbo2, src: fbo1, lut }, () => {
                regl.draw();
                regl.read(this.rgba);
            });
        });
        return this.rgba;
    }
}
