import { addProperty } from '@tsfun/object'
import { silenceRejection, joinUrl } from '@make-mjs/utils'
import { pathExists, stat } from '@make-mjs/fs-extra'
import DEFAULT_FILE_PATH_RESOLVER from './from-file'
import DEFAULT_DIR_PATH_RESOLVER from './from-dir'
import DEFAULT_MJS_PATH_TESTER from './is-mjs-path'
import DEFAULT_INTERNAL_MODULE_TESTER from './is-internal-module'
import DEFAULT_MJS_PACKAGE_TESTER from './is-mjs-package'
import parseModulePath, { ModulePathKind } from './parse-module-path'

import {
  MjsPathOptions,
  FullMjsPathOptions,
  ModulePathResolver,
  ModulePathResolverOptions,
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

  const parsingResult = parseModulePath(modulePath)

  const fullOptions: FullMjsPathOptions = {
    modulePath,
    moduleContainer,
    fromFile,
    fromDir,
    isMjsPath,
    isInternalModule,
    isMjsPackage
  }

  async function handleFile (resolverOptions: ModulePathResolverOptions) {
    if (await isMjsPath(fullOptions)) return modulePath
    return fromFile(resolverOptions)
  }

  async function handleRoute (route: string, resolverOptions: ModulePathResolverOptions) {
    const pathExistsPromise = silenceRejection(pathExists(route))
    const modulePathStatsPromise = silenceRejection(stat(route))

    if (await pathExistsPromise) {
      const stats = await modulePathStatsPromise
      if (stats.isFile()) return handleFile(resolverOptions)
      if (stats.isDirectory()) return fromDir(resolverOptions)
      throw new Error(`Module is neither file nor directory: ${route}`)
    }

    return null
  }

  async function handleModuleContainer (forceMjs: boolean) {
    const resolverOptions = addProperty(fullOptions, 'forceMjs', forceMjs)

    for (const directory of moduleContainer) {
      const route = joinUrl(directory, modulePath)
      const result = await handleRoute(route, resolverOptions)
      if (result) return result
    }

    return handleFile(resolverOptions)
  }

  if (parsingResult.kind === ModulePathKind.Internal) {
    const resolverOptions = addProperty(fullOptions, 'forceMjs', true)
    return (await handleRoute(modulePath, resolverOptions)) || handleFile(resolverOptions)
  }

  const testerOptions = addProperty(fullOptions, 'packageName', parsingResult.name)
  if (await isMjsPackage(testerOptions)) {
    return handleModuleContainer(true)
  }

  return handleModuleContainer(false)
}

export default getMjsPath
