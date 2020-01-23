import { overwrite } from "./utils.js";
export const element = name => (...attrs) => overwrite(document.createElement(name), ...attrs);
export const canvas = element('canvas');
//# sourceMappingURL=dom.js.map