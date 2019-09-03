import { pathExists, readJSON } from 'fs-extra'
import { silenceRejection, joinPath } from '@make-mjs/utils'
import fromFile from './from-file'

interface Options {
  readonly modulePath: string
  readonly moduleContainer: string
  readonly newExt?: string
}

export async function fromDir (options: Options): Promise<string> {
  const { modulePath, moduleContainer, newExt } = options
  const manifest = joinPath(moduleContainer, modulePath, 'package.json')
  const manifestExistsPromise = silenceRejection(pathExists(manifest))
  const manifestContentPromise = silenceRejection(readJSON(manifest))

  function handleFile (entry: string) {
    return fromFile({
      modulePath: joinPath(modulePath, entry),
      newExt
    })
  }

  if (await manifestExistsPromise) {
    const { module, browser, main } = await manifestContentPromise
    if (module) return joinPath(modulePath, module)
    if (browser) return joinPath(modulePath, browser)
    if (main) return handleFile(main)
  }

  return handleFile('index')
}

export default fromDir
