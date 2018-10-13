import { render } from 'wheels/esm/text/template'

export class Shader {
  command: any

  constructor(
    private readonly regl: any,
    private readonly binds: any
  ) {}

  compile(arg: any) {
    const { regl, binds } = this
    const { vert, frag } = binds
    this.command = regl({
      ...binds,
      ...vert && { vert: render(vert, arg) },
      ...frag && { frag: render(frag, arg) }
    })
  }
}
