/* eslint-disable @typescript-eslint/brace-style, no-empty */
import { statSync } from 'fs'
import { dirname, resolve } from 'path'
import * as ts from 'typescript'

const cached = <T, U>(fn: (arg: T) => U, map = new Map<T, U>()) =>
  (arg: T): U => map.has(arg) ? map.get(arg)! : map.set(arg, fn(arg)).get(arg)!

const silent = <T, U>(fn: (arg: T) => U) =>
  (arg: T) => { try { return fn(arg) } catch {} }

const stat = cached(silent(statSync))

const resolveModuleSpecifier = (node: ts.Expression, cwd: string) => {
  const slice = node.getText().slice(1, -1)
  const path = slice.startsWith('.') && resolve(cwd, slice)
  const append = path && (
    stat(`${path}.ts`)?.isFile() && '.js' ||
    stat(path)?.isDirectory() && '/index.js'
  )

  return append ? ts.createLiteral(slice + append) : node
}

const resolveImportDeclaration = (node: ts.Node, cwd: string) => {
  if (!ts.isImportDeclaration(node)) return

  const { decorators, modifiers, importClause, moduleSpecifier } = node
  const resolved = resolveModuleSpecifier(moduleSpecifier, cwd)
  return ts.updateImportDeclaration(node, decorators, modifiers, importClause, resolved)
}

const resolveExportDeclaration = (node: ts.Node, cwd: string) => {
  if (!ts.isExportDeclaration(node) || !node.moduleSpecifier) return

  const { decorators, modifiers, exportClause, moduleSpecifier } = node
  const resolved = resolveModuleSpecifier(moduleSpecifier, cwd)
  return ts.updateExportDeclaration(node, decorators, modifiers, exportClause, resolved)
}

export default (): ts.TransformerFactory<ts.SourceFile> => ctx => sf => {
  const cwd = dirname(sf.fileName)

  const visitor: ts.Visitor = node =>
    resolveImportDeclaration(node, cwd) ??
    resolveExportDeclaration(node, cwd) ??
    ts.visitEachChild(node, visitor, ctx)

  return ts.visitNode(sf, visitor)
}
