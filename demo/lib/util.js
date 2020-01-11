export const frame = () =>
  new Promise(requestAnimationFrame)

export const fetchImage = opts => new Promise((ok, err) => {
  Object.assign(new Image, opts, {
    onload() { ok(this) },
    onerror: err
  })
})

export const context2d = () => {
  const canvas = new OffscreenCanvas(0, 0)
  const context = canvas.getContext('2d')
  return (width, height) => {
    Object.assign(canvas, { width, height })
    return context
  }
}
