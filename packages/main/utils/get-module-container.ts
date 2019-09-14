import { iterateAncestorDirectories, joinPath } from '@make-mjs/utils'

export function * getModuleContainer (path: string, basename = 'node_modules') {
  for (const dir of iterateAncestorDirectories(path)) {
    yield joinPath(dir, basename)
  }
}

export default getModuleContainer
