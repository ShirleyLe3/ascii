import { createElement } from 'https://cdn.jsdelivr.net/npm/preact@10/dist/preact.module.js'
import htm from 'https://cdn.jsdelivr.net/npm/htm@2/dist/htm.module.js'

const html = htm.bind(createElement)

export * from 'https://cdn.jsdelivr.net/npm/preact@10/dist/preact.module.js'
export { htm, html }
