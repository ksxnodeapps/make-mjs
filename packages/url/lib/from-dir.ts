import { objectExtends } from '@tsfun/object'
import { silenceRejection, joinUrl, convertUrlToPath } from '@make-mjs/utils'
import { pathExists, readJSON } from 'fs-extra'
import fromFile from './from-file'

export interface Options {
  readonly modulePath: string
  readonly moduleContainer: readonly string[]
  readonly forceMjs: boolean
  readonly newExt?: string
}

export async function fromDir(options: Options): Promise<string> {
  const { modulePath, moduleContainer, forceMjs } = options

  const manifestArray = moduleContainer.map(item => {
    const manifest = convertUrlToPath(joinUrl(item, modulePath, 'package.json'))
    const manifestExistsPromise = silenceRejection(pathExists(manifest))
    const manifestContentPromise = silenceRejection(readJSON(manifest))
    return { manifestExistsPromise, manifestContentPromise }
  })

  async function handleMainEntry(entry: string) {
    const newModulePath = joinUrl(modulePath, entry)
    const fileOptions = objectExtends(options, {
      modulePath: newModulePath,
      preferredCjsPath: forceMjs ? newModulePath : modulePath,
    })
    return fromFile(fileOptions)
  }

  for (const item of manifestArray) {
    const { manifestExistsPromise, manifestContentPromise } = item

    if (await manifestExistsPromise) {
      const { module, main } = await manifestContentPromise
      if (module) return joinUrl(modulePath, module)
      if (main) return handleMainEntry(main)
    }
  }

  return handleMainEntry('index')
}

export default fromDir
