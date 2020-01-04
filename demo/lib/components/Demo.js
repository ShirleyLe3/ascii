import { Component, html } from '../dom.js'
import { frame } from '../util.js'

const N = 1000

export class Demo extends Component {
  refs = {}
  state = {
    hidden: ' '.repeat(N) + '\n '.repeat(N - 1),
    visible: ''
  }

  async run() {
    const render = await this.props.renderer(this.refs)

    for (this.running = true; this.running; await frame()) {
      const { width: rw, height: rh } = this.refs.root.getBoundingClientRect()
      const { width: hw, height: hh } = this.refs.hidden.getBoundingClientRect()

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
    return html`<div class=demo ref=${e => this.refs.root = e}>
      <div class=hidden ref=${e => this.refs.hidden = e}>${hidden}</>
      <div class=visible ref=${e => this.refs.visible = e}>${visible}</>
    </>`
  }
}
