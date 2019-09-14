import createLock from 'remote-controlled-promise'
import { addProperty } from '@tsfun/object'
import transformPath, { MjsPackageTester } from '@make-mjs/path'
import { Node } from './types'
import parse, { ParserOptions } from './parse-code'
import generate, { GeneratorOptions } from './generate-code'
import traverse from './traverse-import-statements'

export interface NodeTransformOptions {
  readonly moduleContainer: readonly string[]
  readonly isMjsPackage?: MjsPackageTester
}

export async function transformNode (node: Node, options: NodeTransformOptions) {
  let promise = Promise.resolve()

  function deferPromise () {
    const lock = createLock<void>()
    promise = promise.then(() => lock.promise)
    return lock
  }

  traverse(node, {
    async declaration (path) {
      const lock = deferPromise()
      const newOptions = addProperty(options, 'modulePath', path.node.source.value)
      const newPath = await transformPath(newOptions)
      path.node.source.value = newPath
      await lock.resolve(undefined)
    },

    async expression (path) {
      const lock = deferPromise()
      for (const item of path.node.arguments) {
        const newOptions = addProperty(options, 'modulePath', item.value)
        const newPath = await transformPath(newOptions)
        item.value = newPath
      }
      await lock.resolve(undefined)
    }
  })

  await promise
}

export interface CodeTransformOptions extends NodeTransformOptions {
  readonly parserOptions?: ParserOptions
  readonly generatorOptions?: GeneratorOptions
}

export async function transformCode (code: string, options: CodeTransformOptions) {
  const { parserOptions, generatorOptions } = options
  const ast = parse(code, parserOptions)
  await transformNode(ast, options)
  return generate(ast, generatorOptions)
}

export default transformCode
