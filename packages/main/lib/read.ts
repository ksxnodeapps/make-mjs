import { readFile, lstat } from '@make-mjs/fs-extra'
import traverse from './traverse'

import {
  StatFunc,
  ReadOptions,
  FilterFunc,
  File
} from './types'

const FILTER_EXT = ['.js', '.jsx']
export const DEFAULT_FILTER_FUNC: FilterFunc = x => FILTER_EXT.some(ext => x.base.endsWith(ext))
const DEEP_FUNC_IGNORED = ['.git', 'node_modules']
export const DEFAULT_DEEP_FUNC: FilterFunc = x => !DEEP_FUNC_IGNORED.includes(x.base)
export const DEFAULT_STAT_FUNC: StatFunc = lstat

export async function * read (options: ReadOptions): AsyncGenerator<File, void> {
  const {
    dirname,
    filter = DEFAULT_FILTER_FUNC,
    deep = DEFAULT_DEEP_FUNC,
    stat = DEFAULT_STAT_FUNC
  } = options

  for await (const item of traverse(dirname, { deep, stat })) {
    if (!filter(item)) continue
    const { path } = item
    const content = await readFile(path, 'utf8')
    yield { path, content }
  }
}

export default read
