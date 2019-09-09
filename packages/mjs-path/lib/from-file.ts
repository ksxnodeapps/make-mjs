import { pathExists } from 'fs-extra'
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

export async function fromFile (options: ModulePathResolverOptions): Promise<string> {
  const {
    modulePath,
    moduleContainer,
    isMjsPackage,
    modulePathParsingResult,
    forceMjs,
    newExt
  } = options

  const mjsModulePath = fromFileWithoutChecking({ modulePath, newExt })

  if (forceMjs) return mjsModulePath
  if (isMjsPackage) return mjsModulePath
  if (modulePathParsingResult.kind === ModulePathKind.Internal) return mjsModulePath

  if (await pathExists(
    joinPath(moduleContainer, mjsModulePath)
  )) return mjsModulePath

  return modulePath
}

export default fromFile
