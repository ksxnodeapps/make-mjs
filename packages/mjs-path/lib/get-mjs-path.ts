import { pathExists, stat } from 'fs-extra'
import { silenceRejection, joinPath } from '@make-mjs/utils'
import DEFAULT_FILE_PATH_RESOLVER from './from-file'
import DEFAULT_DIR_PATH_RESOLVER from './from-dir'
import DEFAULT_MJS_PATH_TESTER from './is-mjs-path'
import DEFAULT_INTERNAL_MODULE_TESTER from './is-internal-module'
import DEFAULT_MJS_PACKAGE_TESTER from './is-mjs-package'

import {
  MjsPathOptions,
  FullMjsPathOptions,
  ModulePathResolver,
  ModulePathTester,
  MjsPackageTester
} from '../utils/options'

export {
  DEFAULT_FILE_PATH_RESOLVER,
  DEFAULT_DIR_PATH_RESOLVER,
  DEFAULT_INTERNAL_MODULE_TESTER,
  DEFAULT_MJS_PATH_TESTER,
  DEFAULT_MJS_PACKAGE_TESTER,
  MjsPathOptions,
  ModulePathResolver,
  ModulePathTester,
  MjsPackageTester
}

export async function getMjsPath (options: MjsPathOptions): Promise<string> {
  const {
    modulePath,
    moduleContainer,
    fromFile = DEFAULT_FILE_PATH_RESOLVER,
    fromDir = DEFAULT_DIR_PATH_RESOLVER,
    isMjsPath = DEFAULT_MJS_PATH_TESTER,
    isInternalModule = DEFAULT_INTERNAL_MODULE_TESTER,
    isMjsPackage = DEFAULT_MJS_PACKAGE_TESTER
  } = options

  const fullOptions: FullMjsPathOptions = {
    modulePath,
    moduleContainer,
    fromFile,
    fromDir,
    isMjsPath,
    isInternalModule,
    isMjsPackage
  }

  async function handleFile () {
    if (await isMjsPath(fullOptions)) return modulePath
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
    (await isInternalModule(fullOptions))
      ? modulePath
      : joinPath(moduleContainer, modulePath)
  )
}

export default getMjsPath
