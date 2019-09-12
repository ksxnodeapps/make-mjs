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
  EXTERNAL_MODULE_PATH_DEFAULT,
  EXTERNAL_MODULE_MANIFEST_DEFAULT,
  EXTERNAL_MODULE_ENTRY_DEFAULT,
  EXTERNAL_MODULE_ENTRY_DEFAULT_MJS,
  EXTERNAL_MODULE_PATH_NONMJS,
  EXTERNAL_MODULE_MANIFEST_NONMJS,
  EXTERNAL_MODULE_ENTRY_NONMJS
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

  function filter (predicate: (name: string) => boolean) {
    alter(current.filter(predicate))
  }

  function append (addend: readonly Item[]) {
    alter(current.concat(addend))
  }

  return { main, get, fill, empty, alter, toggle, filter, append }
}

const EMPTY_MAP = new Map<never, never>()

function mockMap<Key, Value> (main: ReadonlyMap<Key, Value>) {
  let current: ReadonlyMap<Key, Value> = main

  const get = () => current
  const fill = () => alter(main)
  const empty = () => alter(EMPTY_MAP)

  function alter (map: typeof current) {
    current = map
  }

  function toggle () {
    if (current === main) {
      empty()
    } else {
      fill()
    }
  }

  function filter (predicate: (key: Key, value: Value) => boolean) {
    alter(new Map(
      Array
        .from(current)
        .filter(entry => predicate(...entry))
    ))
  }

  function filterKeys (predicate: (key: Key) => boolean) {
    filter(key => predicate(key))
  }

  function filterValues (predicate: (value: Value) => boolean) {
    filter((_, value) => predicate(value))
  }

  function append (entries: Iterable<readonly [Key, Value]>) {
    const newMap = new Map(current)
    for (const [key, value] of entries) {
      newMap.set(key, value)
    }
    alter(newMap)
  }

  return { main, get, fill, empty, toggle, filter, filterKeys, filterValues, append }
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
  EXTERNAL_MODULE_PATH_DEFAULT,
  EXTERNAL_MODULE_MANIFEST_DEFAULT,
  EXTERNAL_MODULE_ENTRY_DEFAULT,
  EXTERNAL_MODULE_ENTRY_DEFAULT_MJS,
  EXTERNAL_MODULE_PATH_NONMJS,
  EXTERNAL_MODULE_MANIFEST_NONMJS,
  EXTERNAL_MODULE_ENTRY_NONMJS
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
  EXTERNAL_MODULE_MANIFEST_NONMJS,
  EXTERNAL_MODULE_ENTRY_NONMJS
] as const)

export const directories = mockArray([
  MODULE_CONTAINER,
  INTERNAL_DIR_MODULE_PATH,
  INTERNAL_DIR_MODULE_PATH_SUPER,
  EXTERNAL_MODULE_PATH,
  EXTERNAL_MODULE_PATH_MODULE,
  EXTERNAL_MODULE_PATH_BROWSER,
  EXTERNAL_MODULE_PATH_MAIN,
  EXTERNAL_MODULE_PATH_DEFAULT,
  EXTERNAL_MODULE_PATH_NONMJS
] as const)

export interface ManifestContent {
  readonly main?: string
  readonly module?: string
  readonly browser?: string
}

export const manifestFiles = mockMap<string, ManifestContent>(new Map([
  [EXTERNAL_MODULE_MANIFEST_MODULE, { module: ENTRY_MODULE }],
  [EXTERNAL_MODULE_MANIFEST_BROWSER, { browser: ENTRY_BROWSER }],
  [EXTERNAL_MODULE_MANIFEST_MAIN, { main: ENTRY_MAIN_JS }],
  [EXTERNAL_MODULE_MANIFEST_DEFAULT, {}],
  [EXTERNAL_MODULE_MANIFEST_NONMJS, { main: ENTRY_MAIN_JS }]
]))

const allMockedArrays = [allThatIs, files, directories]
const allMockedMaps = [manifestFiles]

export function fillAllMockedArrays () {
  allMockedArrays.forEach(x => x.fill())
}

export function emptyAllMockedArrays () {
  allMockedArrays.forEach(x => x.empty())
}

export function fillAllMockedMaps () {
  allMockedMaps.forEach(x => x.fill())
}

export function emptyAllMockedMaps () {
  allMockedMaps.forEach(x => x.empty())
}

export function filterFilesOrDirs (
  fs: typeof files | typeof directories,
  predicate: (name: string) => boolean
) {
  fs.filter(predicate)
  allThatIs.filter(predicate)
}

export function filterFiles (predicate: (name: string) => boolean) {
  filterFilesOrDirs(files, predicate)
  manifestFiles.filterKeys(predicate)
}

export function filterDirs (predicate: (name: string) => boolean) {
  filterFilesOrDirs(directories, predicate)
}

export function appendFileOrDir (
  fs: typeof files | typeof directories,
  addend: readonly string[]
) {
  fs.append(addend)
  allThatIs.append(addend)
}

export function appendFile (addend: readonly string[]) {
  appendFileOrDir(files, addend)
}

export function appendDir (addend: readonly string[]) {
  appendFileOrDir(directories, addend)
}

export function appendManifest (entries: ReadonlyArray<readonly [string, ManifestContent]>) {
  manifestFiles.append(entries)
  appendFile(entries.map(entry => entry[0]))
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
  const manifest = manifestFiles.get().get(filename)
  if (!manifest) throw new Error(`Unexpected read: ${JSON.stringify(filename)}`)
  return manifest
}
