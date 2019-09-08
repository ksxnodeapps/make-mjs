import { pathExists, readJSON } from 'fs-extra'
import { objectExtends } from '@tsfun/object'
import { silenceRejection, joinPath } from '@make-mjs/utils'
import { FromDirOptions } from '../utils/options'
import fromFile from './from-file'
import { ModulePathKind, parseModulePath } from './parse-module-path'

export async function fromDir (options: FromDirOptions): Promise<string> {
  const { modulePath, moduleContainer, isMjsPackage, newExt } = options
  const manifest = joinPath(moduleContainer, modulePath, 'package.json')
  const manifestExistsPromise = silenceRejection(pathExists(manifest))
  const manifestContentPromise = silenceRejection(readJSON(manifest))

  async function handleMainEntry (entry: string) {
    const parsingResult = parseModulePath(modulePath)
    const mjsModulePath = fromFile({
      modulePath: joinPath(modulePath, entry),
      newExt
    })

    if (parsingResult.kind === ModulePathKind.Internal) return mjsModulePath

    if (await pathExists(
      joinPath(moduleContainer, mjsModulePath)
    )) return mjsModulePath

    if (await isMjsPackage(
      objectExtends(options, {
        packageName: parsingResult.name,
        moduleEntry: entry
      }))
    ) return mjsModulePath

    return modulePath
  }

  if (await manifestExistsPromise) {
    const { module, browser, main } = await manifestContentPromise
    if (module) return joinPath(modulePath, module)
    if (browser) return joinPath(modulePath, browser)
    if (main) return handleMainEntry(main)
  }

  return handleMainEntry('index')
}

export default fromDir
