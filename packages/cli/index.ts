import proceed, { EventType } from '@make-mjs/main'

export enum ExitStatus {
  NoDirectory = 1,
  Success = 0
}

export interface Process {
  readonly exit: (status: ExitStatus) => void
}

export interface Console {
  readonly info: (message: string) => void
  readonly error: (message: string) => void
}

export interface Options {
  readonly directories: readonly string[]
  readonly knownMjsPackages?: readonly string[]
  readonly console: Console
  readonly process: Process
}

export async function main (options: Options) {
  const {
    directories,
    knownMjsPackages = [],
    console,
    process
  } = options

  if (!directories.length) {
    console.error('ERROR: Directory list is empty')
    return process.exit(ExitStatus.NoDirectory)
  }

  for (const dirname of directories) {
    const events = proceed({
      dirname,
      codeTransformOptions: {
        isMjsPackage: param => knownMjsPackages.includes(param.packageName)
      }
    })

    for await (const event of events) {
      if (event.type === EventType.BeforeWrite) {
        console.info(`Writing file: ${event.file.path}`)
      }
    }
  }

  return process.exit(ExitStatus.Success)
}

export default main
