import {
  MODULE_CONTAINER,
  ENTRY_MODULE,
  ENTRY_BROWSER,
  ENTRY_MAIN_JS,
  INTERNAL_FILE_MODULE_PATH,
  INTERNAL_FILE_MODULE_PATH_JS,
  INTERNAL_FILE_MODULE_PATH_MJS,
  INTERNAL_DIR_MODULE_PATH,
  INTERNAL_FILE_MODULE_PATH_SUPER,
  INTERNAL_FILE_MODULE_PATH_JS_SUPER,
  INTERNAL_FILE_MODULE_PATH_MJS_SUPER,
  INTERNAL_DIR_MODULE_PATH_SUPER,
  INTERNAL_NOT_FILE_NOR_DIR,
  EXTERNAL_MODULE_PATH,
  EXTERNAL_MODULE_PATH_MODULE,
  EXTERNAL_MODULE_ENTRY,
  EXTERNAL_MODULE_ENTRY_MJS,
  EXTERNAL_MODULE_MANIFEST_MODULE,
  EXTERNAL_MODULE_PATH_BROWSER,
  EXTERNAL_MODULE_ENTRY_MODULE,
  EXTERNAL_MODULE_MANIFEST_BROWSER,
  EXTERNAL_MODULE_ENTRY_BROWSER,
  EXTERNAL_MODULE_PATH_MAIN,
  EXTERNAL_MODULE_MANIFEST_MAIN,
  EXTERNAL_MODULE_ENTRY_MAIN,
  EXTERNAL_MODULE_ENTRY_MAIN_MJS,
  EXTERNAL_MODULE_NAME_DEFAULT,
  EXTERNAL_MODULE_PATH_DEFAULT,
  EXTERNAL_MODULE_MANIFEST_DEFAULT,
  EXTERNAL_MODULE_ENTRY_DEFAULT,
  EXTERNAL_MODULE_ENTRY_DEFAULT_MJS
} from './paths'

type ElementOf<Iter extends Iterable<any>> = Iter extends Iterable<infer X> ? X : never

const EMPTY_ARRAY = [] as const

function mockArray<
  MainArray extends readonly any[]
> (main: MainArray) {
  type Item = ElementOf<MainArray>
  let current: MainArray | readonly Item[] = main

  const get = () => current
  const fill = () => alter(main)
  const empty = () => alter(EMPTY_ARRAY)

  function alter (value: typeof current) {
    current = value
  }

  function toggle () {
    if (current === main) {
      empty()
    } else {
      fill()
    }
  }

  return { main, get, fill, empty, alter, toggle }
}

export const allThatIs = mockArray([
  MODULE_CONTAINER,
  INTERNAL_FILE_MODULE_PATH,
  INTERNAL_FILE_MODULE_PATH_JS,
  INTERNAL_FILE_MODULE_PATH_MJS,
  INTERNAL_DIR_MODULE_PATH,
  INTERNAL_FILE_MODULE_PATH_SUPER,
  INTERNAL_FILE_MODULE_PATH_JS_SUPER,
  INTERNAL_FILE_MODULE_PATH_MJS_SUPER,
  INTERNAL_DIR_MODULE_PATH_SUPER,
  INTERNAL_NOT_FILE_NOR_DIR,
  EXTERNAL_MODULE_PATH,
  EXTERNAL_MODULE_PATH_MODULE,
  EXTERNAL_MODULE_ENTRY,
  EXTERNAL_MODULE_ENTRY_MJS,
  EXTERNAL_MODULE_MANIFEST_MODULE,
  EXTERNAL_MODULE_ENTRY_MODULE,
  EXTERNAL_MODULE_PATH_BROWSER,
  EXTERNAL_MODULE_MANIFEST_BROWSER,
  EXTERNAL_MODULE_ENTRY_BROWSER,
  EXTERNAL_MODULE_PATH_MAIN,
  EXTERNAL_MODULE_MANIFEST_MAIN,
  EXTERNAL_MODULE_ENTRY_MAIN,
  EXTERNAL_MODULE_ENTRY_MAIN_MJS,
  EXTERNAL_MODULE_NAME_DEFAULT,
  EXTERNAL_MODULE_PATH_DEFAULT,
  EXTERNAL_MODULE_MANIFEST_DEFAULT,
  EXTERNAL_MODULE_ENTRY_DEFAULT,
  EXTERNAL_MODULE_ENTRY_DEFAULT_MJS
] as const)

export const files = mockArray([
  INTERNAL_FILE_MODULE_PATH,
  INTERNAL_FILE_MODULE_PATH_JS,
  INTERNAL_FILE_MODULE_PATH_MJS,
  INTERNAL_FILE_MODULE_PATH_SUPER,
  INTERNAL_FILE_MODULE_PATH_JS_SUPER,
  INTERNAL_FILE_MODULE_PATH_MJS_SUPER,
  EXTERNAL_MODULE_MANIFEST_MODULE,
  EXTERNAL_MODULE_ENTRY_MODULE,
  EXTERNAL_MODULE_MANIFEST_BROWSER,
  EXTERNAL_MODULE_ENTRY_BROWSER,
  EXTERNAL_MODULE_MANIFEST_MAIN,
  EXTERNAL_MODULE_ENTRY_MAIN,
  EXTERNAL_MODULE_ENTRY_MAIN_MJS,
  EXTERNAL_MODULE_MANIFEST_DEFAULT,
  EXTERNAL_MODULE_ENTRY_DEFAULT,
  EXTERNAL_MODULE_ENTRY_DEFAULT_MJS
] as const)

export const directories = mockArray([
  MODULE_CONTAINER,
  INTERNAL_DIR_MODULE_PATH,
  INTERNAL_DIR_MODULE_PATH_SUPER,
  EXTERNAL_MODULE_PATH,
  EXTERNAL_MODULE_PATH_MODULE,
  EXTERNAL_MODULE_PATH_BROWSER,
  EXTERNAL_MODULE_PATH_MAIN,
  EXTERNAL_MODULE_PATH_DEFAULT
] as const)

const allMockedArrays = [allThatIs, files, directories]

export function fillAllMockedArrays () {
  allMockedArrays.forEach(x => x.fill())
}

export function emptyAllMockedArrays () {
  allMockedArrays.forEach(x => x.empty())
}

export async function pathExists (path: string) {
  return allThatIs.get().includes(path)
}

export const enum StatType {
  File = 'File',
  Dir = 'Dir',
  Unknown = 'Unknown'
}

export function getStatType (path: string) {
  if (files.get().includes(path)) return StatType.File
  if (directories.get().includes(path)) return StatType.Dir
  return StatType.Unknown
}

class Stats {
  constructor (
    private readonly type: StatType
  ) {}

  public isFile () {
    return this.type === StatType.File
  }

  public isDirectory () {
    return this.type === StatType.Dir
  }
}

async function assertExist (path: string) {
  if (await pathExists(path)) return
  throw new Error(`ENOENT: no such file or directory, stat ${JSON.stringify(path)}`)
}

export async function stat (path: string) {
  await assertExist(path)
  return new Stats(getStatType(path))
}

export async function readJSON (filename: string) {
  await assertExist(filename)

  switch (filename) {
    case EXTERNAL_MODULE_MANIFEST_MODULE:
      return { module: ENTRY_MODULE } as const
    case EXTERNAL_MODULE_MANIFEST_BROWSER:
      return { browser: ENTRY_BROWSER } as const
    case EXTERNAL_MODULE_MANIFEST_MAIN:
      return { main: ENTRY_MAIN_JS } as const
    case EXTERNAL_MODULE_MANIFEST_DEFAULT:
      return {} as const
  }

  throw new Error(`Unexpected read: ${JSON.stringify(filename)}`)
}
