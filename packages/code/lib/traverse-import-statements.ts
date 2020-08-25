import traverse from '@babel/traverse'

import {
  Node,
  ImportDeclaration,
  ExportAllDeclaration,
  ExportNamedDeclaration,
  CallExpression,
  Import,
  StringLiteral,
  NodePath,
  NodePathVisitor,
} from './types'

export type ImportStatement =
  | ImportStatement.Declaration
  | ImportStatement.Expression

export namespace ImportStatement {
  interface NamedReexport extends ExportNamedDeclaration {
    readonly source: StringLiteral
  }

  export type Declaration =
    | ImportDeclaration
    | ExportAllDeclaration
    | NamedReexport

  export interface Expression extends CallExpression {
    callee: Import
    arguments: StringLiteral[]
  }
}

export interface TraversalOptions {
  readonly declaration: NodePathVisitor<ImportStatement.Declaration>
  readonly expression: NodePathVisitor<ImportStatement.Expression>
}

export function traverseImportStatements(node: Node, options: TraversalOptions): void {
  const { declaration, expression } = options

  traverse(node as any, {
    enter(path) {
      switch (path.node.type) {
        case 'ImportDeclaration':
        case 'ExportAllDeclaration':
        case 'ExportNamedDeclaration':
          if (path.node.source) {
            declaration(path as NodePath<ImportStatement.Declaration>)
          }
          break
        case 'CallExpression':
          if (path.node.callee.type === 'Import') {
            expression(path as NodePath<ImportStatement.Expression>)
          }
          break
      }
    },
  })
}

export default traverseImportStatements
