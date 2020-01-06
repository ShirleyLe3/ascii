import { Component, createRef, html } from '../dom.js'
import { frame } from '../util.js'

const N = 1000

const bcr = ref =>
  ref.current.getBoundingClientRect()

export class Demo extends Component {
  root = createRef()
  hidden = createRef()
  visible = createRef()
  state = {
    hidden: ' '.repeat(N) + '\n '.repeat(N - 1),
    visible: ''
  }

  async run() {
    const render = await this.props.renderer(this)

    for (this.running = true; this.running; await frame()) {
      const { width: rw, height: rh } = bcr(this.root)
      const { width: hw, height: hh } = bcr(this.hidden)

      const w = Math.floor(N * rw/hw)
      const h = Math.floor(N * rh/hh)
      const r = rw / rh
      const t = performance.now()

      this.setState({ visible: render(w, h, r, t) })
    }
  }

  componentDidMount() {
    this.run()
  }

  componentWillUnmount() {
    this.running = false
  }

  render({}, { hidden, visible }) {
    return html`<div class=demo ref=${this.root}>
      <div class=hidden ref=${this.hidden}>${hidden}</>
      <div class=visible ref=${this.visible}>${visible}</>
    </>`
  }
}
