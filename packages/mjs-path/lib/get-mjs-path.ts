import { pathExists, stat } from 'fs-extra'
import { MaybePromise, silenceRejection, joinPath } from '@make-mjs/utils'
import DEFAULT_FILE_PATH_RESOLVER from './from-file'
import DEFAULT_DIR_PATH_RESOLVER from './from-dir'
import DEFAULT_MJS_PATH_TESTER from './is-mjs-path'
import DEFAULT_INTERNAL_MODULE_TESTER from './is-internal-module'

export {
  DEFAULT_FILE_PATH_RESOLVER,
  DEFAULT_DIR_PATH_RESOLVER,
  DEFAULT_INTERNAL_MODULE_TESTER,
  DEFAULT_MJS_PATH_TESTER
}

type FullOptions = Required<MjsPathOptions>

export interface ModulePathResolver {
  (modulePath: FullOptions): MaybePromise<string>
}

export interface ModulePathTester {
  (modulePath: string): MaybePromise<boolean>
}

export interface MjsPathOptions {
  readonly modulePath: string
  readonly moduleContainer: string
  readonly fromFile?: ModulePathResolver
  readonly fromDir?: ModulePathResolver
  readonly isMjsPath?: ModulePathTester
  readonly isInternalModule?: ModulePathTester
}

export async function getMjsPath (options: MjsPathOptions): Promise<string> {
  const {
    modulePath,
    moduleContainer,
    fromFile = DEFAULT_FILE_PATH_RESOLVER,
    fromDir = DEFAULT_DIR_PATH_RESOLVER,
    isMjsPath = DEFAULT_MJS_PATH_TESTER,
    isInternalModule = DEFAULT_INTERNAL_MODULE_TESTER
  } = options

  const fullOptions: FullOptions = {
    modulePath,
    moduleContainer,
    fromFile,
    fromDir,
    isMjsPath,
    isInternalModule
  }

  async function handleFile () {
    if (await isMjsPath(modulePath)) return modulePath
    return fromFile(fullOptions)
  }

  async function handleRoute (route: string) {
    const pathExistsPromise = silenceRejection(pathExists(route))
    const modulePathStatsPromise = silenceRejection(stat(route))

    if (await pathExistsPromise) {
      const stats = await modulePathStatsPromise
      if (stats.isFile()) return handleFile()
      if (stats.isDirectory()) return fromDir(fullOptions)
      throw new Error(`Module is neither file nor directory: ${route}`)
    } else {
      return handleFile()
    }
  }

  return handleRoute(
    isInternalModule(modulePath)
      ? modulePath
      : joinPath(moduleContainer, modulePath)
  )
}

export default getMjsPath
