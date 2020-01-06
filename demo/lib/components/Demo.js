import { React, html, styled } from '../dom.js'
import { frame } from '../util.js'

const N = 1000

const Root = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font: 9pt/1em 'Consolas', monospace;
  & > * { white-space: pre; }
`

const Hidden = styled.div`
  position: fixed;
  bottom: 100%;
  right: 100%;
`

const Visible = styled.div``

export class Demo extends React.Component {
  root = React.createRef()
  hidden = React.createRef()
  visible = React.createRef()

  state = {
    hidden: ' '.repeat(N) + '\n '.repeat(N - 1),
    visible: ''
  }

  async run() {
    const render = await this.props.renderer(this)

    for (this.running = true; this.running; await frame()) {
      const { width: rw, height: rh } = this.root.current.getBoundingClientRect()
      const { width: hw, height: hh } = this.hidden.current.getBoundingClientRect()

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

  render() {
    const { hidden, visible } = this.state
    return html`<${Root} ref=${this.root}>
      <${Hidden} ref=${this.hidden}>${hidden}</>
      <${Visible} ref=${this.visible}>${visible}</>
    </>`
  }
}
