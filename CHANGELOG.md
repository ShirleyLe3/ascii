# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.14.7](https://github.com/reinventing-wheels/ascii/compare/v0.14.6...v0.14.7) (2020-01-11)


### Bug Fixes

* oof, the technology isn't there yet ([b429e10](https://github.com/reinventing-wheels/ascii/commit/b429e107740d38ec86c6196f2aad0a4f8d665ac8))

### [0.14.6](https://github.com/reinventing-wheels/ascii/compare/v0.14.5...v0.14.6) (2020-01-11)


### Features

* use `OffscreenCanvas` ([54701c7](https://github.com/reinventing-wheels/ascii/commit/54701c7a97bcb5331acbdb9ab33a96d5b62a1d8d))

### [0.14.5](https://github.com/reinventing-wheels/ascii/compare/v0.14.4...v0.14.5) (2020-01-11)


### Features

* avoid unnecessary canvas creations ([8dea840](https://github.com/reinventing-wheels/ascii/commit/8dea840a450abc9d43c47ca0912d9bb8f66a5d99))


### Bug Fixes

* could not render `video` elements ([7e9f73e](https://github.com/reinventing-wheels/ascii/commit/7e9f73e7f8a7fa2f9236ee15927d7cc3fe525692))
* was buggy on android ([242db60](https://github.com/reinventing-wheels/ascii/commit/242db604d625929119af9d0476622d6004dfdfa9))

### [0.14.4](https://github.com/reinventing-wheels/ascii/compare/v0.14.3...v0.14.4) (2020-01-09)


### Features

* refactor settings ([ee77e40](https://github.com/reinventing-wheels/ascii/commit/ee77e4005e1671a0420754cc1b7bef48b6d07799))
* subtle optimization ([eea30f6](https://github.com/reinventing-wheels/ascii/commit/eea30f6227f6abc2d1bd9a589fabdb641e9f0804))

### [0.14.3](https://github.com/reinventing-wheels/ascii/compare/v0.14.2...v0.14.3) (2020-01-05)


### Bug Fixes

* didn't work on linux ([1e2c4b5](https://github.com/reinventing-wheels/ascii/commit/1e2c4b585b99524f98a029c180c9b25faf286917))

### [0.14.2](https://github.com/reinventing-wheels/ascii/compare/v0.14.1...v0.14.2) (2020-01-04)


### Features

* improve resize logic ([a7c1de9](https://github.com/reinventing-wheels/ascii/commit/a7c1de9ba801ffc0b27a5f7714e1087019ef4613))

### [0.14.1](https://github.com/reinventing-wheels/ascii/compare/v0.14.0...v0.14.1) (2020-01-03)


### Features

* remove `¯` character from charsets ([8427406](https://github.com/reinventing-wheels/ascii/commit/84274060c0c48b1c2df5d2d09ab1951d2801d990))


### Bug Fixes

* `[a, b)` -> `[a, b]` ([a27a231](https://github.com/reinventing-wheels/ascii/commit/a27a2311992beef2577669d6ca19e8dde944f385))

## [0.14.0](https://github.com/reinventing-wheels/ascii/compare/v0.13.0...v0.14.0) (2020-01-02)


### ⚠ BREAKING CHANGES

* rename `unicode` charset to `extra`

### Features

* export types ([e33c582](https://github.com/reinventing-wheels/ascii/commit/e33c5824ceb2ec1d2174c7c2d5f6de5d6c4c0101))
* rename `unicode` charset to `extra` ([68c93a6](https://github.com/reinventing-wheels/ascii/commit/68c93a68a525851d9ee6b435e283bb74acc0d72a))

## [0.13.0](https://github.com/reinventing-wheels/ascii/compare/v0.12.2...v0.13.0) (2020-01-01)


### ⚠ BREAKING CHANGES

* minify `private` and `protected` class members

### Features

* minify `private` and `protected` class members ([9f00a5e](https://github.com/reinventing-wheels/ascii/commit/9f00a5e75e3d04a8e49620b25bfc7305a8cc9c31))

### [0.12.2](https://github.com/reinventing-wheels/ascii/compare/v0.12.1...v0.12.2) (2019-12-31)


### Bug Fixes

* remove `Renderer::api` ([90ed0ec](https://github.com/reinventing-wheels/ascii/commit/90ed0ece7c3de6be4ba8339a8b711aca7eb2e1e3))

### [0.12.1](https://github.com/reinventing-wheels/ascii/compare/v0.12.0...v0.12.1) (2019-12-30)

## [0.12.0](https://github.com/reinventing-wheels/ascii/compare/v0.11.0...v0.12.0) (2019-12-18)


### ⚠ BREAKING CHANGES

* rename a few settings

### Features

* add `fontBase` ([46c376c](https://github.com/reinventing-wheels/ascii/commit/46c376c701c4939cfa77e98c80e6c8ff8e1dfd65))
* export static methods as functions ([60e15f2](https://github.com/reinventing-wheels/ascii/commit/60e15f2c3f3aa6fef6151f07b150796df1e107fa))
* refactoring and improvements ([86c78e5](https://github.com/reinventing-wheels/ascii/commit/86c78e5f4dcdf8ec379632ddaa287540715ebc5b))
* rename a few settings ([b82a1de](https://github.com/reinventing-wheels/ascii/commit/b82a1debd18e72ec5ba3e6e5292461d04e458ed9))
* use fallback method of downscaling as the main one ([f051d75](https://github.com/reinventing-wheels/ascii/commit/f051d75066bb8da103f17f0a4fb6e510b9b871c0))

## [0.11.0](https://github.com/reinventing-wheels/ascii/compare/v0.10.1...v0.11.0) (2019-12-11)


### ⚠ BREAKING CHANGES

* rename `Renderer` classes

### Features

* rename `Renderer` classes ([6b3350e](https://github.com/reinventing-wheels/ascii/commit/6b3350e5b338f42402db17fd0d3ad8fda6caf0a1))

### [0.10.1](https://github.com/reinventing-wheels/ascii/compare/v0.10.0...v0.10.1) (2019-12-10)


### Features

* add `lutMin` and `lutMax` ([9d1b7e0](https://github.com/reinventing-wheels/ascii/commit/9d1b7e036eb92e1ae83b3a25017bbb441195e4b6))

<a name="0.10.0"></a>
# [0.10.0](https://github.com/reinventing-wheels/ascii/compare/v0.9.0...v0.10.0) (2019-05-09)


### Features

* add `lutGamma` ([9d42369](https://github.com/reinventing-wheels/ascii/commit/9d42369))
* add 3rd alphabet ([13a6187](https://github.com/reinventing-wheels/ascii/commit/13a6187))



<a name="0.9.0"></a>
# [0.9.0](https://github.com/reinventing-wheels/ascii/compare/v0.8.0...v0.9.0) (2019-04-17)


### Features

* remove `CoreSettings` ([53fbf42](https://github.com/reinventing-wheels/ascii/commit/53fbf42))
* use fibonacci sequence for blurring ([2fce900](https://github.com/reinventing-wheels/ascii/commit/2fce900))



<a name="0.8.0"></a>
# [0.8.0](https://github.com/reinventing-wheels/ascii/compare/v0.7.0...v0.8.0) (2019-04-16)


### Features

* add `fontGamma` ([55da05c](https://github.com/reinventing-wheels/ascii/commit/55da05c))
* webgl2 port, software renderer, regl is no longer a dependency ([d260055](https://github.com/reinventing-wheels/ascii/commit/d260055))



<a name="0.7.0"></a>
# [0.7.0](https://github.com/reinventing-wheels/ascii/compare/v0.6.0...v0.7.0) (2018-10-19)


### Features

* remove `commonjs` build target ([afa67a4](https://github.com/reinventing-wheels/ascii/commit/afa67a4))
* remove sup/subscripts and some other weird chars ([1c0e062](https://github.com/reinventing-wheels/ascii/commit/1c0e062))



<a name="0.6.0"></a>
# [0.6.0](https://github.com/reinventing-wheels/ascii/compare/v0.5.0...v0.6.0) (2018-10-19)


### Features

* even more chars ([679c8a3](https://github.com/reinventing-wheels/ascii/commit/679c8a3))
* filter non-monospace chars ([d107823](https://github.com/reinventing-wheels/ascii/commit/d107823))
* render to floats ([87b810a](https://github.com/reinventing-wheels/ascii/commit/87b810a))



<a name="0.5.0"></a>
# [0.5.0](https://github.com/reinventing-wheels/ascii/compare/v0.4.0...v0.5.0) (2018-10-19)


### Features

* more chars ([2048838](https://github.com/reinventing-wheels/ascii/commit/2048838))



<a name="0.4.0"></a>
# [0.4.0](https://github.com/reinventing-wheels/ascii/compare/v0.3.0...v0.4.0) (2018-10-18)


### Bug Fixes

* shader math ([bc98e2d](https://github.com/reinventing-wheels/ascii/commit/bc98e2d))


### Features

* floor `width` and `height` ([3744cac](https://github.com/reinventing-wheels/ascii/commit/3744cac))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/reinventing-wheels/ascii/compare/v0.2.0...v0.3.0) (2018-10-18)


### Features

* add `quality` option ([8bb3751](https://github.com/reinventing-wheels/ascii/commit/8bb3751))



<a name="0.2.0"></a>
# [0.2.0](https://github.com/reinventing-wheels/ascii/compare/v0.1.1...v0.2.0) (2018-10-17)


### Features

* better templates ([6e73291](https://github.com/reinventing-wheels/ascii/commit/6e73291))
* less fragment shader memory usage ([31dccf4](https://github.com/reinventing-wheels/ascii/commit/31dccf4))



<a name="0.1.1"></a>
## [0.1.1](https://github.com/reinventing-wheels/ascii/compare/v0.1.0...v0.1.1) (2018-09-27)


### Bug Fixes

* forgot to use `ttsc` instead of `tsc` ([6b41035](https://github.com/reinventing-wheels/ascii/commit/6b41035))



<a name="0.1.0"></a>
# 0.1.0 (2018-09-22)


### Features

* initial commit ([d05322a](https://github.com/reinventing-wheels/ascii/commit/d05322a))
