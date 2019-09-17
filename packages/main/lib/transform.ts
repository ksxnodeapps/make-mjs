import { objectExtends } from '@tsfun/object'
import { replacePathExtension } from '@make-mjs/utils'
import { CodeTransformOptions, DEFAULT_PARSER_OPTIONS, transformCode } from '@make-mjs/code'
import { getModuleContainer } from '../utils/get-module-container'

import {
  TransformOptions,
  PathTransformFunc,
  File
} from './types'

export const DEFAULT_PATH_TRANSFORM_FUNC: PathTransformFunc = path => replacePathExtension(path, '.mjs')

export async function * transform (options: TransformOptions): AsyncGenerator<File, void> {
  const {
    files,
    getNewPath = DEFAULT_PATH_TRANSFORM_FUNC,
    codeTransformOptions = {}
  } = options

  for await (const { path, content } of files) {
    const newPath = getNewPath(path)
    const parserOptions = { // object spread because of how @babel/parser read this options object
      ...codeTransformOptions.parserOptions || DEFAULT_PARSER_OPTIONS,
      sourceFilename: path
    }
    const newCodeTransOpts: CodeTransformOptions = objectExtends(codeTransformOptions, {
      moduleContainer: Array.from(getModuleContainer(path)),
      parserOptions
    })
    const transformResult = await transformCode(content, newCodeTransOpts)
    yield {
      path: newPath,
      content: transformResult.code
    }
  }
}

export default transform
