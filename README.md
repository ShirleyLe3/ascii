Makes ASCII-art from any renderable input ([demo][demo])

## Installation

```sh
yarn add reinventing-wheels/ascii
```

## Usage

```js
import * as ASCII from 'ascii/dist/esm'

// fast, uses webgl2
const renderer = new ASCII.HardwareRenderer({
  // `standard` and `extended` are available
  // you can also use your own, of course
  alphabet: ASCII.alphabets.standard,

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

[demo]: //reinventing-wheels.github.io/ascii/demo/
