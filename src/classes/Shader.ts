import { hashBrackets as format } from 'wheels/esm/text/format'
import { copy } from 'wheels/esm/object'

export class Shader {
  command: any

  constructor(
    private readonly regl: any,
    private readonly binds: any
  ) {}

  compile(...args: any[]) {
    const binds = copy(this.binds)
    const { vert, frag } = binds
    if (vert) binds.vert = format(vert)(...args)
    if (frag) binds.frag = format(frag)(...args)
    this.command = this.regl(binds)
  }
}
