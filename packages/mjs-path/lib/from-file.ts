import { pathExists } from 'fs-extra'
import once from 'exec-once'
import { addProperty } from '@tsfun/object'
import { joinPath, parsePath } from '@make-mjs/utils'
import { ModulePathResolverOptions } from '../utils/options'
import { ModulePathKind } from './parse-module-path'

interface OptionsWithoutForceMjs {
  readonly modulePath: string
  readonly newExt?: string
}

export function fromFileWithoutChecking (options: OptionsWithoutForceMjs): string {
  const { modulePath, newExt = '.mjs' } = options
  const { dir, name, ext } = parsePath(modulePath)
  if (ext === '.js' || ext === '') return joinPath(dir, name + newExt)
  return modulePath
}

interface Options extends ModulePathResolverOptions {
  readonly preferredCjsPath?: string
}

export async function fromFile (options: Options): Promise<string> {
  const {
    modulePath,
    moduleContainer,
    isMjsPackage,
    modulePathParsingResult,
    forceMjs,
    newExt,
    preferredCjsPath = modulePath
  } = options

  const mjsModulePath = once(() => fromFileWithoutChecking({ modulePath, newExt }))

  if (forceMjs) return mjsModulePath()
  if (modulePathParsingResult.kind === ModulePathKind.Internal) return mjsModulePath()

  const testerOptions = addProperty(options, 'packageName', modulePathParsingResult.name)
  if (await isMjsPackage(testerOptions)) return mjsModulePath()

  if (await pathExists(
    joinPath(moduleContainer, mjsModulePath())
  )) return mjsModulePath()

  return preferredCjsPath
}

export default fromFile
