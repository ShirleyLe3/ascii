import * as ts from 'typescript'
import * as glsl from 'glsl-man'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'

const minifyShader = (shader: string) => {
  const ast = glsl.parse(shader)
  return glsl.string(ast, { tab: '', space: '', newline: '' })
}

const getNameIdentifier = (ic: ts.ImportClause) => {
  return ic.namedBindings
    ? ts.isNamedImports(ic.namedBindings)
      ? ic.namedBindings.elements[0].name
      : ic.namedBindings.name
    : ic.name
}

const makeConst = (name: string, value: string) => {
  const decl = ts.createVariableDeclaration(name, undefined, ts.createLiteral(value))
  const list = ts.createVariableDeclarationList(ts.createNodeArray([decl]), ts.NodeFlags.Const)
  return ts.createVariableStatement(undefined, list)
}

const transformImport = (node: ts.Node, cwd: string) => {
  if (!ts.isImportDeclaration(node)) return
  if (!node.importClause) return node

  const name = getNameIdentifier(node.importClause).getText()
  const path = node.moduleSpecifier.getText().slice(1, -1)
  const resolved = resolve(path.startsWith('.') ? cwd : '.', path)

  if (/\.(?:glsl|vert|frag)$/i.test(path)) {
    const shader = readFileSync(resolved, 'utf8')
    return makeConst(name, minifyShader(shader))
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
