import { convertUrlToPath } from '@make-mjs/utils'

import {
  MODULE_CONTAINER,
  ENTRY_MODULE,
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
  EXTERNAL_MODULE_ENTRY_MODULE,
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
  EXTERNAL_MODULE_ENTRY_NONMJS,
} from './paths'

type ElementOf<Iter extends Iterable<any>> = Iter extends Iterable<infer X> ? X : never

const EMPTY_ARRAY = [] as const

function mockArray<
  MainArray extends readonly any[],
>(main: MainArray) {
  type Item = ElementOf<MainArray>
  let current: MainArray | readonly Item[] = main

  const get = () => current
  const fill = () => alter(main)
  const empty = () => alter(EMPTY_ARRAY)

  function alter(value: typeof current) {
    current = value
  }

  function toggle() {
    if (current === main) {
      empty()
    } else {
      fill()
    }
  }

  function filter(predicate: (name: string) => boolean) {
    alter(current.filter(predicate))
  }

  function append(addend: readonly Item[]) {
    alter(current.concat(addend))
  }

  function dedup() {
    alter(current.filter((x, i, a) => a.indexOf(x) === i))
  }

  return { main, get, fill, empty, alter, toggle, filter, append, dedup }
}

const EMPTY_MAP = new Map<never, never>()

function mockMap<Key, Value>(main: ReadonlyMap<Key, Value>) {
  let current: ReadonlyMap<Key, Value> = main

  const get = () => current
  const fill = () => alter(main)
  const empty = () => alter(EMPTY_MAP)

  function alter(map: typeof current) {
    current = map
  }

  function toggle() {
    if (current === main) {
      empty()
    } else {
      fill()
    }
  }

  function filter(predicate: (key: Key, value: Value) => boolean) {
    alter(
      new Map(
        Array
          .from(current)
          .filter(entry => predicate(...entry)),
      ),
    )
  }

  function filterKeys(predicate: (key: Key) => boolean) {
    filter(key => predicate(key))
  }

  function filterValues(predicate: (value: Value) => boolean) {
    filter((_, value) => predicate(value))
  }

  function append(entries: Iterable<readonly [Key, Value]>) {
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
  EXTERNAL_MODULE_ENTRY_NONMJS,
].map(convertUrlToPath))

export const files = mockArray([
  INTERNAL_FILE_MODULE_PATH,
  INTERNAL_FILE_MODULE_PATH_JS,
  INTERNAL_FILE_MODULE_PATH_MJS,
  INTERNAL_FILE_MODULE_PATH_SUPER,
  INTERNAL_FILE_MODULE_PATH_JS_SUPER,
  INTERNAL_FILE_MODULE_PATH_MJS_SUPER,
  EXTERNAL_MODULE_MANIFEST_MODULE,
  EXTERNAL_MODULE_ENTRY_MODULE,
  EXTERNAL_MODULE_MANIFEST_MAIN,
  EXTERNAL_MODULE_ENTRY_MAIN,
  EXTERNAL_MODULE_ENTRY_MAIN_MJS,
  EXTERNAL_MODULE_MANIFEST_DEFAULT,
  EXTERNAL_MODULE_ENTRY_DEFAULT,
  EXTERNAL_MODULE_MANIFEST_NONMJS,
  EXTERNAL_MODULE_ENTRY_NONMJS,
].map(convertUrlToPath))

export const directories = mockArray([
  MODULE_CONTAINER,
  INTERNAL_DIR_MODULE_PATH,
  INTERNAL_DIR_MODULE_PATH_SUPER,
  EXTERNAL_MODULE_PATH,
  EXTERNAL_MODULE_PATH_MODULE,
  EXTERNAL_MODULE_PATH_MAIN,
  EXTERNAL_MODULE_PATH_DEFAULT,
  EXTERNAL_MODULE_PATH_NONMJS,
].map(convertUrlToPath))

export interface ManifestContent {
  readonly main?: string
  readonly module?: string
}

export const manifestFiles = mockMap<string, ManifestContent>(
  new Map([
    [EXTERNAL_MODULE_MANIFEST_MODULE, { module: ENTRY_MODULE }],
    [EXTERNAL_MODULE_MANIFEST_MAIN, { main: ENTRY_MAIN_JS }],
    [EXTERNAL_MODULE_MANIFEST_DEFAULT, {}],
    [EXTERNAL_MODULE_MANIFEST_NONMJS, { main: ENTRY_MAIN_JS }],
  ]),
)

export const textFiles = mockMap<string, string>(new Map())

const allMockedArrays = [allThatIs, files, directories]
const allMockedMaps = [manifestFiles, textFiles]

export function fillAllMockedArrays() {
  allMockedArrays.forEach(x => x.fill())
}

export function emptyAllMockedArrays() {
  allMockedArrays.forEach(x => x.empty())
}

export function fillAllMockedMaps() {
  allMockedMaps.forEach(x => x.fill())
}

export function emptyAllMockedMaps() {
  allMockedMaps.forEach(x => x.empty())
}

export function fillAll() {
  fillAllMockedArrays()
  fillAllMockedMaps()
}

export function emptyAll() {
  emptyAllMockedArrays()
  emptyAllMockedMaps()
}

export function filterFilesOrDirs(
  fs: typeof files | typeof directories,
  predicate: (name: string) => boolean,
) {
  fs.filter(predicate)
  allThatIs.filter(predicate)
}

export function filterFiles(predicate: (name: string) => boolean) {
  filterFilesOrDirs(files, predicate)
  manifestFiles.filterKeys(predicate)
}

export function filterDirs(predicate: (name: string) => boolean) {
  filterFilesOrDirs(directories, predicate)
}

export function appendFileOrDir(
  fs: typeof files | typeof directories,
  addend: readonly string[],
) {
  const paths = addend.map(convertUrlToPath)
  fs.append(paths)
  allThatIs.append(paths)
}

export function appendFile(addend: readonly string[]) {
  appendFileOrDir(files, addend)
}

export function appendDir(addend: readonly string[]) {
  appendFileOrDir(directories, addend)
}

export function appendManifest(entries: ReadonlyArray<readonly [string, ManifestContent]>) {
  manifestFiles.append(entries.map(([url, content]) => [
    convertUrlToPath(url),
    content,
  ]))
  appendFile(entries.map(entry => entry[0]))
}

export namespace appendManifest {
  export function fromObject(object: { readonly [_: string]: ManifestContent }) {
    appendManifest(Object.entries(object))
  }
}

export function appendTextFile(entries: ReadonlyArray<readonly [string, string]>) {
  textFiles.append(entries.map(([url, content]) => [convertUrlToPath(url), content]))
  appendFile(entries.map(entry => entry[0]))
  files.dedup()
  allThatIs.dedup()
}

export namespace appendTextFile {
  export function fromObject(object: { readonly [_: string]: string }) {
    appendTextFile(Object.entries(object))
  }
}

type FileSystemItem = string | ManifestContent | null

function getParentDirectory(path: string) {
  return path.split('/').slice(0, -1).join('/')
}

export function appendFileSystem(entries: ReadonlyArray<readonly [string, FileSystemItem]>) {
  for (const [url, content] of entries) {
    const path = convertUrlToPath(url)
    ensureDirSync(getParentDirectory(path))

    if (content === null) {
      appendDir([path])
    } else if (typeof content === 'object') {
      appendManifest([[path, content]])
    } else if (path.endsWith('.json')) {
      appendManifest([[path, JSON.parse(content)]])
    } else {
      appendTextFile([[path, content]])
    }
  }
}

export namespace appendFileSystem {
  export function fromObject(object: { readonly [_: string]: FileSystemItem }) {
    appendFileSystem(Object.entries(object))
  }
}

export async function pathExists(path: string) {
  if (path === '.') return true
  return allThatIs.get().includes(path)
}

export const enum StatType {
  File = 'File',
  Dir = 'Dir',
  Unknown = 'Unknown',
}

export function getStatType(path: string) {
  if (files.get().includes(path)) return StatType.File
  if (directories.get().includes(path)) return StatType.Dir
  return StatType.Unknown
}

class Stats {
  constructor(
    private readonly type: StatType,
  ) {}

  public isFile() {
    return this.type === StatType.File
  }

  public isDirectory() {
    return this.type === StatType.Dir
  }
}

async function assertExist(path: string) {
  if (await pathExists(path)) return
  throw new Error(`ENOENT: no such file or directory, stat ${JSON.stringify(path)}`)
}

export async function stat(path: string) {
  await assertExist(path)
  return new Stats(getStatType(path))
}

export const lstat = stat

export async function readJSON(filename: string) {
  await assertExist(filename)
  const manifest = manifestFiles.get().get(filename)
  if (!manifest) throw new Error(`Unexpected read: ${JSON.stringify(filename)}`)
  return manifest
}

export async function readFile(filename: string) {
  await assertExist(filename)
  const content = textFiles.get().get(filename)
  if (content !== undefined) return content
  const manifest = readJSON(filename)
  return JSON.stringify(manifest, undefined, 2)
}

export async function writeFile(filename: string, content: string) {
  appendTextFile([[filename, content]])
}

export function readdirSync(dirname: string) {
  function firstSegment(path: string) {
    return path.split('/')[0]
  }

  function getItemList(paths: readonly string[]) {
    return paths
      .map(firstSegment)
      .filter((x, i, a) => a.indexOf(x) === i)
  }

  if (dirname === '' || dirname === '.') {
    return getItemList(allThatIs.get())
  }

  if (!dirname.endsWith('/')) dirname += '/'

  return getItemList(
    allThatIs
      .get()
      .filter(path => path.startsWith(dirname))
      .map(path => path.slice(dirname.length)),
  )
}

export async function readdir(dirname: string) {
  return readdirSync(dirname)
}

export function ensureDirSync(dirname: string) {
  const paths = dirname
    .split('/')
    .map((_, i, a) => a.slice(0, i + 1).join('/'))

  appendDir(paths)
  directories.dedup()
}
