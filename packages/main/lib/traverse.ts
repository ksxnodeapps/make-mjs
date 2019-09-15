import { join } from 'path' // not @make-mjs/utils#joinPath since we're not dealing with import urls
import { readdir } from '@make-mjs/fs-extra'
import { TraverseOptions, TraverseReturn } from './types'

export async function * traverse (
  dirname: string,
  options: Required<TraverseOptions>
): AsyncGenerator<TraverseReturn, void> {
  const { deep, stat } = options

  for (const base of await readdir(dirname)) {
    const path = join(dirname, base)
    const stats = await stat(path)

    if (!stats.isDirectory()) {
      yield { path, base }
    } else if (deep({ path, base })) {
      yield * traverse(path, options)
    }
  }
}

export default traverse
