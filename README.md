Makes ASCII-art from any renderable input

- [`CPURenderer` demo][demo-cpu]
- [`GPURenderer` demo][demo-gpu]

## Installation

> **Tip:** see [Git URLs as Dependencies][git-urls]

```sh
npm install reinventing-wheels/ascii
```

## Usage

> **Tip:** use [VSCode][vsc] or any other editor with [TypeScript][ts] declarations support

```js
import * as ASCII from 'ascii/dist/esm'

// fast, uses webgl2
const renderer = new ASCII.GPURenderer({
  // `ascii`, `extended` and `unicode` are available
  // you can also provide your own, of course
  alphabet: ASCII.alphabets.ascii,

  // should match the font you're going to use
  // to display the result
  fontFace: 'monospace',

  // rendering settings
  brightness: 1.0,
  gamma: 1.0,
  noise: 0.0
})

// slow, uses canvas 2d api
const renderer = new ASCII.CPURenderer({
  // ...
})

const source = // image, video, canvas or bitmap
const result = renderer.render(source, width, height)
// `result` is `height` lines of text
// each is `width` symbols wide
```

> **Note:** the library is browser-only, the example assumes using something to bundle the code

[ts]: //www.typescriptlang.org
[vsc]: //code.visualstudio.com
[git-urls]: //docs.npmjs.com/files/package.json#git-urls-as-dependencies
[demo-cpu]: //reinventing-wheels.github.io/ascii/demo/cpu.html
[demo-gpu]: //reinventing-wheels.github.io/ascii/demo/gpu.html
