export const frame = () =>
  new Promise(requestAnimationFrame)

export const update = (target, src) =>
  Object.entries(src)
    .filter(([k, v]) => target[k] !== v)
    .forEach(([k, v]) => target[k] = v)

export const fetchImage = opts => new Promise((ok, err) => {
  Object.assign(new Image, opts, {
    onload() { ok(this) },
    onerror: err
  })
})
