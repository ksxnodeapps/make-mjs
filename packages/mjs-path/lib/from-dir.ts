import { pathExists, readJSON } from 'fs-extra'
import { addProperty } from '@tsfun/object'
import { silenceRejection, joinPath } from '@make-mjs/utils'
import { ModulePathResolverOptions } from '../utils/options'
import fromFile from './from-file'

export async function fromDir (options: ModulePathResolverOptions): Promise<string> {
  const { modulePath, moduleContainer } = options
  const manifest = joinPath(moduleContainer, modulePath, 'package.json')
  const manifestExistsPromise = silenceRejection(pathExists(manifest))
  const manifestContentPromise = silenceRejection(readJSON(manifest))

  async function handleMainEntry (entry: string) {
    const newModulePath = joinPath(modulePath, entry)
    const fileOptions = addProperty(options, 'modulePath', newModulePath)
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
