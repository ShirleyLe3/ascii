import { max, clz32 } from 'wheels/esm/math'
import { context2d } from 'wheels/esm/dom'

// most significant bit (but msb(x) is always >=1)
const msb = (n: number) => 1 << max(0, 31 - clz32(n))

export const downscale = (src: CanvasRenderingContext2D, width: number, height: number) => {
  let w = msb(src.canvas.width  / width  - 1) * width
  let h = msb(src.canvas.height / height - 1) * height

  const tmp = context2d({ width: w, height: h })()
  tmp.drawImage(src.canvas, 0, 0, w, h)
  for (let x, y; x = w > width, y = h > height, x || y;)
    tmp.drawImage(tmp.canvas, 0, 0, w, h, 0, 0, w >>= +x, h >>= +y)

  const dst = context2d({ width, height })()
  dst.drawImage(tmp.canvas, 0, 0)
  return dst
}
