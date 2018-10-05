Makes ASCII-art from any renderable input
([demo](//reinventing-wheels.github.io/ascii/demo/))

## Installation

```sh
yarn add reinventing-wheels/ascii regl
```

## Usage

**Note:** the library is browser-only, this example assumes you're using build tools.

```js
import REGL from 'regl'
import ASCII from 'ascii/dist/esm'

const ascii = new ASCII(REGL, {
  // brightness, gamma, noise, etc.
  // typings available!
})

const renderable = // image, video, canvas or bitmap
const result = ascii.render(renderable, width, height)
```
