import { join } from 'path' // always use path.join when we are not dealing with module urls
import iterateAncestorDirectories from 'ancestor-directories'

export function* getModuleContainer(path: string, basename = 'node_modules') {
  for (const dir of iterateAncestorDirectories(path)) {
    yield join(dir, basename)
  }
}

export default getModuleContainer
