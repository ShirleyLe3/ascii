"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const object_1 = require("wheels/esm/object");
const dom_1 = require("wheels/esm/dom");
const Setup_1 = require("./shaders/Setup");
const Pass1_1 = require("./shaders/Pass1");
const Pass2_1 = require("./shaders/Pass2");
class Renderer {
    constructor(ascii) {
        this.ascii = ascii;
        this.context = dom_1.context2d();
        this.canvas = this.context.canvas;
        this.rgba = new Float32Array(1);
        const { regl } = ascii;
        this.src = regl.texture();
        this.lut = regl.texture();
        this.fbo1 = regl.framebuffer({ depthStencil: false, colorType: 'float' });
        this.fbo2 = regl.framebuffer({ depthStencil: false, colorType: 'float' });
        this.setup = new Setup_1.Setup(regl);
        this.pass1 = new Pass1_1.Pass1(regl);
        this.pass2 = new Pass2_1.Pass2(regl);
    }
    resize(renderable, width, height) {
        const { context, canvas, ascii: { settings: { quality } } } = this;
        if (quality === 'low')
            return renderable;
        if (canvas.width !== width || canvas.height !== height) {
            object_1.overwrite(canvas, { width, height });
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
exports.Renderer = Renderer;
