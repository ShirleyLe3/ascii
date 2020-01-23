/* eslint-disable @typescript-eslint/brace-style, no-empty */
import { statSync } from 'fs';
import { dirname, resolve } from 'path';
import * as ts from 'typescript';
const cached = (fn, map = new Map()) => (arg) => map.has(arg) ? map.get(arg) : map.set(arg, fn(arg)).get(arg);
const silent = (fn) => (arg) => { try {
    return fn(arg);
}
catch { } };
const stat = cached(silent(statSync));
const resolveModuleSpecifier = (node, cwd) => {
    var _a, _b;
    const slice = node.getText().slice(1, -1);
    const path = slice.startsWith('.') && resolve(cwd, slice);
    const append = path && (((_a = stat(`${path}.ts`)) === null || _a === void 0 ? void 0 : _a.isFile()) && '.js' ||
        ((_b = stat(path)) === null || _b === void 0 ? void 0 : _b.isDirectory()) && '/index.js');
    return append ? ts.createLiteral(slice + append) : node;
};
const resolveImportDeclaration = (node, cwd) => {
    if (!ts.isImportDeclaration(node))
        return;
    const { decorators, modifiers, importClause, moduleSpecifier } = node;
    const resolved = resolveModuleSpecifier(moduleSpecifier, cwd);
    return ts.updateImportDeclaration(node, decorators, modifiers, importClause, resolved);
};
const resolveExportDeclaration = (node, cwd) => {
    if (!ts.isExportDeclaration(node) || !node.moduleSpecifier)
        return;
    const { decorators, modifiers, exportClause, moduleSpecifier } = node;
    const resolved = resolveModuleSpecifier(moduleSpecifier, cwd);
    return ts.updateExportDeclaration(node, decorators, modifiers, exportClause, resolved);
};
export default () => ctx => sf => {
    const cwd = dirname(sf.fileName);
    const visitor = node => { var _a, _b; return _b = (_a = resolveImportDeclaration(node, cwd), (_a !== null && _a !== void 0 ? _a : resolveExportDeclaration(node, cwd))), (_b !== null && _b !== void 0 ? _b : ts.visitEachChild(node, visitor, ctx)); };
    return ts.visitNode(sf, visitor);
};
//# sourceMappingURL=esm.js.map