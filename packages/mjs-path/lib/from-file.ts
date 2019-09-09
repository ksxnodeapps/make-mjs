import { joinPath, parsePath } from '@make-mjs/utils'

interface Options {
  readonly modulePath: string
  readonly newExt?: string
}

export function fromFile (options: Options): string {
  const { modulePath, newExt = '.mjs' } = options
  const { dir, name, ext } = parsePath(modulePath)
  if (ext === '.js' || ext === '') return joinPath(dir, name + newExt)
  return modulePath
}

export default fromFile
