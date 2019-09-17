import { addProperty } from '@tsfun/object'
import { silenceRejection, joinUrl } from '@make-mjs/utils'
import { pathExists, stat } from '@make-mjs/fs-extra'
import DEFAULT_FILE_URL_RESOLVER from './from-file'
import DEFAULT_DIR_URL_RESOLVER from './from-dir'
import DEFAULT_MJS_URL_TESTER from './is-mjs-url'
import DEFAULT_INTERNAL_MODULE_TESTER from './is-internal-module'
import DEFAULT_MJS_PACKAGE_TESTER from './is-mjs-package'
import parseModuleUrl, { ModuleUrlKind } from './parse-module-url'

import {
  MjsPathOptions,
  FullMjsPathOptions,
  ModuleUrlResolver,
  ModulePathResolverOptions,
  ModuleUrlTester,
  MjsPackageTester
} from '../utils/options'

export {
  DEFAULT_FILE_URL_RESOLVER,
  DEFAULT_DIR_URL_RESOLVER,
  DEFAULT_INTERNAL_MODULE_TESTER,
  DEFAULT_MJS_URL_TESTER,
  DEFAULT_MJS_PACKAGE_TESTER,
  MjsPathOptions,
  ModuleUrlResolver,
  ModuleUrlTester,
  MjsPackageTester
}

export async function getMjsUrl (options: MjsPathOptions): Promise<string> {
  const {
    modulePath,
    moduleContainer,
    fromFile = DEFAULT_FILE_URL_RESOLVER,
    fromDir = DEFAULT_DIR_URL_RESOLVER,
    isMjsUrl = DEFAULT_MJS_URL_TESTER,
    isInternalModule = DEFAULT_INTERNAL_MODULE_TESTER,
    isMjsPackage = DEFAULT_MJS_PACKAGE_TESTER
  } = options

  const parsingResult = parseModuleUrl(modulePath)

  const fullOptions: FullMjsPathOptions = {
    modulePath,
    moduleContainer,
    fromFile,
    fromDir,
    isMjsUrl,
    isInternalModule,
    isMjsPackage
  }

  async function handleFile (resolverOptions: ModulePathResolverOptions) {
    if (await isMjsUrl(fullOptions)) return modulePath
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

  if (parsingResult.kind === ModuleUrlKind.Internal) {
    const resolverOptions = addProperty(fullOptions, 'forceMjs', true)
    return (await handleRoute(modulePath, resolverOptions)) || handleFile(resolverOptions)
  }

  const testerOptions = addProperty(fullOptions, 'packageName', parsingResult.name)
  if (await isMjsPackage(testerOptions)) {
    return handleModuleContainer(true)
  }

  return handleModuleContainer(false)
}

export default getMjsUrl
