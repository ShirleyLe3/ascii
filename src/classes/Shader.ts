import { hashBrackets as format } from 'wheels/esm/text/format'

export class Shader {
  command: any

  constructor(
    private readonly regl: any,
    private readonly binds: any
  ) {}

  compile(...args: any[]) {
    const { regl, binds } = this
    const { vert, frag } = binds
    this.command = regl({
      ...binds,
      ...vert && { vert: format(vert)(...args) },
      ...frag && { frag: format(frag)(...args) }
    })
  }
}
