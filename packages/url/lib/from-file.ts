import once from 'exec-once'
import { joinUrl, parseUrl } from '@make-mjs/utils'
import { pathExists } from '@make-mjs/fs-extra'

interface OptionsWithoutForceMjs {
  readonly modulePath: string
  readonly newExt?: string
  readonly preferredCjsPath?: string
}

export function fromFileWithoutChecking (options: OptionsWithoutForceMjs): string {
  const { modulePath, newExt = '.mjs', preferredCjsPath = modulePath } = options
  const { dir, name, ext } = parseUrl(modulePath)
  if (ext === '.js' || ext === '') return joinUrl(dir, name + newExt)
  return preferredCjsPath
}

interface Options {
  readonly modulePath: string
  readonly moduleContainer: readonly string[]
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

  for (const item of moduleContainer) {
    if (await pathExists(
      joinUrl(item, mjsModulePath())
    )) return mjsModulePath()
  }

  return preferredCjsPath
}

export default fromFile
