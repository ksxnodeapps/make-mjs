import * as babelTypes from '@babel/types'
import { NodePath } from '@babel/traverse'

export * from '@babel/types'
export { NodePath }

export interface NodePathVisitor<Node = babelTypes.Node> {
  (path: NodePath<Node>): void
}
