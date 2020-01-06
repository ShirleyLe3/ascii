import React from '//dev.jspm.io/react'
import ReactDOM from '//dev.jspm.io/react-dom'
import htm from '//dev.jspm.io/htm'
import core from '//dev.jspm.io/@emotion/core'
import cssʹ from '//dev.jspm.io/@emotion/css'
import styledʹ from '//dev.jspm.io/@emotion/styled'

export const css = cssʹ.default
export const styled = styledʹ.default
export const html = htm.bind(core.jsx)
export { React, ReactDOM, htm, core }
