Makes ASCII-art from any renderable input

- [`SoftwareRenderer` demo][sw]
- [`HardwareRenderer` demo][hw]

## Installation

```sh
npm install reinventing-wheels/ascii
```

## Usage

```js
import * as ASCII from 'ascii/dist/esm'

// fast, uses webgl2
const renderer = new ASCII.HardwareRenderer({
  // `ascii`, `extended` and `unicode` are available
  // you can also use your own, of course
  alphabet: ASCII.alphabets.ascii,

  // should match the font you're going to use
  // to display the result
  fontFace: 'monospace',

  brightness: 1.0,
  gamma: 1.0,
  noise: 0.0
})

// slow, uses canvas 2d api
const renderer = new ASCII.SoftwareRenderer({
  // ...
})

const source = // image, video, canvas or bitmap
const result = renderer.render(source, width, height)
// `result` is `height` lines of text
// each is `width` symbols wide
```

**Note:** the library is browser-only, the example assumes you're using build tools

[hw]: //reinventing-wheels.github.io/ascii/demo/hw.html
[sw]: //reinventing-wheels.github.io/ascii/demo/sw.html
