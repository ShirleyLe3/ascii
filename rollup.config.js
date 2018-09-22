import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import merge from 'deepmerge'
import tts from 'ttypescript'
import pkg from './package.json'

const production = !process.env.ROLLUP_WATCH
const globals = {}

const base = {
  input: 'src/index.ts',
  output: {
    globals,
    freeze: false,
    interop: false,
    sourcemap: true
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      clean: true,
      typescript: tts,
      tsconfigOverride: {
        compilerOptions: {
          module: 'esnext',
          sourceMap: true
        }
      }
    })
  ],
  external: Object.keys(globals)
}

const umd = merge(base, {
  output: {
    format: 'umd',
    file: pkg.browser,
    name: pkg.name.toUpperCase()
  }
})

const min = merge(umd, {
  output: {
    file: pkg.browser.replace(/\w+$/, 'min.$&')
  },
  plugins: [
    terser({
      ecma: 8,
      compress: {
        unsafe: true,
        unsafe_arrows: true,
        unsafe_comps: true,
        unsafe_Function: true,
        unsafe_math: true,
        unsafe_methods: true,
        unsafe_proto: true,
        unsafe_regexp: true,
        unsafe_undefined: true,
        pure_getters: true
      }
    })
  ]
})

export default production
  ? [ umd, min ]
  : [ umd ]
