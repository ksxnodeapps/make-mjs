import { pathExists } from 'fs-extra'
import once from 'exec-once'
import { joinPath, parsePath } from '@make-mjs/utils'

interface OptionsWithoutForceMjs {
  readonly modulePath: string
  readonly newExt?: string
  readonly preferredCjsPath?: string
}

export function fromFileWithoutChecking (options: OptionsWithoutForceMjs): string {
  const { modulePath, newExt = '.mjs', preferredCjsPath = modulePath } = options
  const { dir, name, ext } = parsePath(modulePath)
  if (ext === '.js' || ext === '') return joinPath(dir, name + newExt)
  return preferredCjsPath
}

interface Options {
  readonly modulePath: string
  readonly moduleContainer: string
  readonly forceMjs: boolean
  readonly newExt?: string
  readonly preferredCjsPath?: string
}

export async function fromFile (options: Options): Promise<string> {
  const {
    modulePath,
    moduleContainer,
    forceMjs,
    newExt,
    preferredCjsPath = modulePath
  } = options

  const mjsModulePath = once(
    () => fromFileWithoutChecking({ modulePath, newExt, preferredCjsPath })
  )

  if (forceMjs) return mjsModulePath()

  if (await pathExists(
    joinPath(moduleContainer, mjsModulePath())
  )) return mjsModulePath()

  return preferredCjsPath
}

export default fromFile
