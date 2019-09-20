import { join } from 'path'
import { readFile, readdir, lstat } from 'fs-extra'
import traverse from 'fast-traverse'

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

  const traverseReturn = traverse({
    dirname,
    readdir,
    stat,
    join,
    deep: param => deep({ base: param.basename, path: param.path })
  })

  for await (const { list, dirname } of traverseReturn) {
    const promises = list
      .map(base => {
        const path = join(dirname, base)
        return { base, path }
      })
      .filter(filter)
      .map(async ({ path }) => {
        const content = await readFile(path, 'utf8')
        return { path, content }
      })

    for (const item of promises) {
      yield item
    }
  }
}

export default read
