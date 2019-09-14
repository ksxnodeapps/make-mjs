import { traverse } from 'fs-tree-utils'
import { readFile, lstat } from '@make-mjs/fs-extra'

import {
  TraversalDeepFunc,
  TraversalStatFunc,
  ReadOptions,
  FilterFunc,
  OutputFileList
} from './types'

const FILTER_EXT = ['.js', '.jsx']
export const DEFAULT_FILTER_FUNC: FilterFunc = x => FILTER_EXT.some(ext => x.item.endsWith(ext))
const DEEP_FUNC_IGNORED = ['.git', 'node_modules']
export const DEFAULT_DEEP_FUNC: TraversalDeepFunc = x => !DEEP_FUNC_IGNORED.includes(x.item)
export const DEFAULT_STAT_FUNC: TraversalStatFunc = lstat

export async function read (options: ReadOptions): OutputFileList {
  const {
    dirname,
    filter = DEFAULT_FILTER_FUNC,
    deep = DEFAULT_DEEP_FUNC,
    stat = DEFAULT_STAT_FUNC
  } = options

  const promises = (await traverse(dirname, { deep, stat }))
    .filter(filter)
    .map(async ({ path }) => ({
      path,
      content: await readFile(path, 'utf8')
    }))

  return promises
}

export default read
