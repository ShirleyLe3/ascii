import { context2d } from 'wheels/esm/dom';
export const str = String.fromCharCode;
export const chr = (str) => str.charCodeAt(0);
export const monospaced = (font) => {
    const api = context2d()({ font: `1em ${font}` });
    const ref = api.measureText(' ');
    return (char) => api.measureText(char).width === ref.width;
};
