import { overwrite } from './utils';
export const element = (name) => (...attributes) => overwrite(document.createElement(name), ...attributes);
export const canvas = element('canvas');
//# sourceMappingURL=dom.js.map