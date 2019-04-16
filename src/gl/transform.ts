import * as ts from 'typescript'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'

const isShaderSourceFile = /\.(?:glsl|vert|frag)$/i

const minifyShaderSource = (shader: string) =>
  shader
    .replace(/\/\*[^]*\*\/|\/\/.+/g, '') // remove comments
    .replace(/\s+/g, m => m[0]) // compress whitespaces

const extractNameIdentifier = (ic: ts.ImportClause) =>
  ic.namedBindings
    ? ts.isNamedImports(ic.namedBindings)
      ? ic.namedBindings.elements[0].name
      : ic.namedBindings.name
    : ic.name

const createConstStatement = (name: string, value: string) => {
  const decl = ts.createVariableDeclaration(name, undefined, ts.createLiteral(value))
  const list = ts.createVariableDeclarationList([decl], ts.NodeFlags.Const)
  return ts.createVariableStatement(undefined, list)
}

const transformImport = (node: ts.Node, cwd: string) => {
  if (!ts.isImportDeclaration(node)) return
  if (!node.importClause) return node

  const name = extractNameIdentifier(node.importClause)!.getText()
  const path = node.moduleSpecifier.getText().slice(1, -1)
  const resolved = resolve(path.startsWith('.') ? cwd : '.', path)

  if (isShaderSourceFile.test(path)) {
    const value = minifyShaderSource(readFileSync(resolved, 'utf8'))
    return createConstStatement(name, value)
  }

  return node
}

export default (): ts.TransformerFactory<ts.SourceFile> => ctx => sf => {
  const cwd = dirname(sf.fileName)

  const visitor: ts.Visitor = node =>
    transformImport(node, cwd) ||
    ts.visitEachChild(node, visitor, ctx)

  return ts.visitNode(sf, visitor)
}
