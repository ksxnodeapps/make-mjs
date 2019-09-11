import traverse from '@babel/traverse'

import {
  Node,
  ImportDeclaration,
  CallExpression,
  Import,
  StringLiteral,
  NodePath,
  NodePathVisitor
} from './types'

export type ImportStatement =
  ImportStatement.Declaration |
  ImportStatement.Expression

export namespace ImportStatement {
  // export type Declaration = ImportDeclaration
  // export type Expression = CallExpression & { readonly callee: Import }

  export interface Declaration extends ImportDeclaration {}

  export interface Expression extends CallExpression {
    callee: Import
    arguments: StringLiteral[]
  }
}

export interface TraversalOptions {
  readonly declaration: NodePathVisitor<ImportStatement.Declaration>
  readonly expression: NodePathVisitor<ImportStatement.Expression>
}

export function traverseImportStatements (node: Node, options: TraversalOptions): void {
  const { declaration, expression } = options

  traverse(node, {
    enter (path) {
      switch (path.node.type) {
        case 'ImportDeclaration':
          declaration(path as NodePath<ImportStatement.Declaration>)
          break
        case 'CallExpression':
          if (path.node.callee.type === 'Import') {
            expression(path as NodePath<ImportStatement.Expression>)
          }
          break
      }
    }
  })
}

export default traverseImportStatements
