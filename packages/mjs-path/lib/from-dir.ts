import { objectExtends } from '@tsfun/object'
import { silenceRejection, joinPath } from '@make-mjs/utils'
import { pathExists, readJSON } from '@make-mjs/fs-extra'
import fromFile from './from-file'

export interface Options {
  readonly modulePath: string
  readonly moduleContainer: string
  readonly forceMjs: boolean
  readonly newExt?: string
}

export async function fromDir (options: Options): Promise<string> {
  const { modulePath, moduleContainer, forceMjs } = options
  const manifest = joinPath(moduleContainer, modulePath, 'package.json')
  const manifestExistsPromise = silenceRejection(pathExists(manifest))
  const manifestContentPromise = silenceRejection(readJSON(manifest))

  async function handleMainEntry (entry: string) {
    const newModulePath = joinPath(modulePath, entry)
    const fileOptions = objectExtends(options, {
      modulePath: newModulePath,
      preferredCjsPath: forceMjs ? newModulePath : modulePath
    })
    return fromFile(fileOptions)
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
