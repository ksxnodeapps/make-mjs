import { addProperty, objectExtends } from '@tsfun/object'
import { replacePathExtension } from '@make-mjs/utils'
import { CodeTransformOptions, transformCode } from '@make-mjs/file'
import { getModuleContainer } from '../utils/get-module-container'

import {
  TransformOptions,
  PathTransformFunc,
  OutputFileList
} from './types'

export const DEFAULT_PATH_TRANSFORM_FUNC: PathTransformFunc = path => replacePathExtension(path, '.mjs')

export async function transform (options: TransformOptions): OutputFileList {
  const {
    files,
    getNewPath = DEFAULT_PATH_TRANSFORM_FUNC,
    codeTransformOptions = {}
  } = options

  const promises = (await files).map(async promise => {
    const { path, content } = await promise
    const newPath = getNewPath(path)
    const parserOptions = addProperty(
      codeTransformOptions.parserOptions || {},
      'sourceFilename',
      path
    )
    const newCodeTransOpts: CodeTransformOptions = objectExtends(codeTransformOptions, {
      moduleContainer: Array.from(getModuleContainer(path)),
      parserOptions
    })
    const transformResult = await transformCode(content, newCodeTransOpts)
    return {
      path: newPath,
      content: transformResult.code
    }
  })

  return promises
}

export default transform
