import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import * as ts from 'typescript';
const isShaderSourceFile = /\.(?:glsl|vert|frag)$/i;
const minifyShaderSource = (shaderSource) => shaderSource
    .replace(/\/\*[^]*\*\/|\/\/.*/g, '') // remove comments
    .replace(/\s+/g, m => m[0]) // compress whitespaces
    .replace(/^#.*/mg, '$&\0') // terminate preprocessor directives with \0
    .replace(/\s*([-+*/<>(){};,=])\s*/g, '$1') // remove whitespaces
    .replace(/\0/g, ''); // remove \0
const extractNameIdentifier = (ic) => ic.namedBindings
    ? ts.isNamedImports(ic.namedBindings)
        ? ic.namedBindings.elements[0].name
        : ic.namedBindings.name
    : ic.name;
const createConstStatement = (name, value) => {
    const decl = ts.createVariableDeclaration(name, undefined, ts.createLiteral(value));
    const list = ts.createVariableDeclarationList([decl], ts.NodeFlags.Const);
    return ts.createVariableStatement(undefined, list);
};
const inlineShaderSource = (node, cwd) => {
    if (!ts.isImportDeclaration(node))
        return;
    if (!node.importClause)
        return node;
    const spec = node.moduleSpecifier.getText().slice(1, -1);
    if (isShaderSourceFile.test(spec)) {
        const name = extractNameIdentifier(node.importClause).getText();
        const path = resolve(spec.startsWith('.') ? cwd : '.', spec);
        const value = minifyShaderSource(readFileSync(path, 'utf8'));
        return createConstStatement(name, value);
    }
    return node;
};
export default () => ctx => sf => {
    const cwd = dirname(sf.fileName);
    const visitor = node => { var _a; return _a = inlineShaderSource(node, cwd), (_a !== null && _a !== void 0 ? _a : ts.visitEachChild(node, visitor, ctx)); };
    return ts.visitNode(sf, visitor);
};
//# sourceMappingURL=glsl.js.map