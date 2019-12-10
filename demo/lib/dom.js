import { createElement } from 'https://unpkg.com/preact@10?module'
import htm from 'https://unpkg.com/htm@2?module'

const html = htm.bind(createElement)

export * from 'https://unpkg.com/preact@10?module'
export { htm, html }
