import { ExitStatus, main } from '@make-mjs/cli'
import { formatCode } from '@tools/test-utils'
import yaml from 'js-yaml'

import {
  files,
  directories,
  manifestFiles,
  textFiles,
  emptyAll,
  fillAll,
  appendFileSystem
} from './fsx-mocks'

const DUMMY_JS_CONTENT = 'not to be read'

function makeValidFiles () {
  emptyAll()

  appendFileSystem.fromObject({
    'node_modules/external-nonmjs-nonmjs/package.json': {
      main: 'nonmjs-nonmjs-entry.js'
    },
    'node_modules/external-nonmjs-nonmjs/nonmjs-nonmjs-entry.js': DUMMY_JS_CONTENT,
    'node_modules/external-nonmjs-mjs/package.json': {
      main: 'nonmjs-mjs-entry.js'
    },
    'node_modules/external-nonmjs-mjs/nonmjs-mjs-entry.js': DUMMY_JS_CONTENT,
    'node_modules/external-mjs-main/package.json': {
      main: 'mjs-entry.js'
    },
    'node_modules/external-mjs-main/mjs-entry.js': DUMMY_JS_CONTENT,
    'node_modules/external-mjs-main/mjs-entry.mjs': DUMMY_JS_CONTENT,
    'node_modules/@scope/foo/package.json': {
      module: 'scope-module-entry.mjs'
    },
    'node_modules/@scope/foo/scope-module-entry.js': DUMMY_JS_CONTENT,
    'node_modules/@scope/foo/scope-module-entry.mjs': DUMMY_JS_CONTENT,
    'top-level-file-0.js': formatCode(`
      import 'external-nonmjs-nonmjs'
      import 'external-nonmjs-mjs'
      import 'external-mjs-main'
      import '@scope/foo'
    `),
    'top-level-file-1.js': formatCode(`
      import './top-level-file-0'
    `),
    'lib/foo.js': formatCode(`
      export * from '../top-level-file-1'
    `),
    'src/bar.js': formatCode(`
      export * from '../lib/foo'
    `),

    'abc/def/node_modules/deep-external/package.json': {
      module: 'deep-module-entry.mjs'
    },
    'abc/def/node_modules/deep-external/deep-module-entry.mjs': DUMMY_JS_CONTENT,
    'abc/def/ghi/jkl/deep-file-0.js': formatCode(`
      export async function main () {
        await import('deep-external')
        await import('external-nonmjs-nonmjs')
        await import('external-nonmjs-mjs')
        await import('external-mjs-main')
        await import('@scope/foo')
      }
    `),

    'ghi/node_modules/deep-external/package.json': {
      browser: 'deep-browser-entry.mjs'
    },
    'ghi/node_modules/deep-external/deep-browser-entry.mjs': DUMMY_JS_CONTENT,
    'ghi/node_modules/@scope/foo/package.json': {
      main: 'deep-scope-foo-main-entry.js'
    },
    'ghi/node_modules/@scope/foo/deep-scope-foo-main-entry.js': DUMMY_JS_CONTENT,
    'ghi/node_modules/@scope/foo/deep-scope-foo-main-entry.mjs': DUMMY_JS_CONTENT,
    'ghi/deep-file-1.js': formatCode(`
      export * from 'deep-external'
      export * from '@scope/foo'
    `)
  })
}

function getFilesystemSnapshot () {
  function map2arr<Key, Value> (map: ReadonlyMap<Key, Value>) {
    return Array.from(map).map(([path, content]) => ({ path, content }))
  }

  const yamlString = yaml.safeDump({
    filenames: files.get(),
    dirnames: directories.get(),
    manifestFiles: map2arr(manifestFiles.get()),
    textFiles: map2arr(textFiles.get()).map(({ path, content }) => ({
      path,
      content: content === DUMMY_JS_CONTENT
        ? content
        : formatCode(content).trim()
    }))
  })

  return '\n' + yamlString + '\n'
}

describe('knownMjsPackages = ["external-nonmjs-mjs"]', () => {
  const knownMjsPackages = ['external-nonmjs-mjs']

  async function setup (directories: readonly string[]) {
    const info = jest.fn()
    const error = jest.fn()
    const exit = jest.fn()
    makeValidFiles()
    await main({
      directories,
      knownMjsPackages,
      console: { info, error },
      process: { exit }
    })
    return { info, error, exit }
  }

  describe('directories = []', () => {
    const directories = [] as const

    it('does not call console.info', async () => {
      const { info } = await setup(directories)
      expect(info).not.toBeCalled()
    })

    it('calls console.error once', async () => {
      const { error } = await setup(directories)
      expect(error).toBeCalledTimes(1)
    })

    it('calls console.error with expected arguments', async () => {
      const { error } = await setup(directories)
      expect(error).toBeCalledWith('ERROR: Directory list is empty')
    })

    it('calls process.exit once', async () => {
      const { exit } = await setup(directories)
      expect(exit).toBeCalledTimes(1)
    })

    it('calls process.exit with ExitStatus.NoDirectory', async () => {
      const { exit } = await setup(directories)
      expect(exit).toBeCalledWith(ExitStatus.NoDirectory)
    })
  })

  describe('directories = [""]', () => {
    const directories = ['']

    it('calls console.info several times', async () => {
      const { info } = await setup(directories)
      expect(info.mock.calls).toMatchSnapshot()
    })

    it('does not call console.error', async () => {
      const { error } = await setup(directories)
      expect(error).not.toBeCalled()
    })

    it('calls process.exit once', async () => {
      const { exit } = await setup(directories)
      expect(exit).toBeCalledTimes(1)
    })

    it('calls process.exit with ExitStatus.Success', async () => {
      const { exit } = await setup(directories)
      expect(exit).toBeCalledWith(ExitStatus.Success)
    })

    it('resulting filesystem matches snapshot', async () => {
      await setup(directories)
      expect(getFilesystemSnapshot()).toMatchSnapshot()
    })
  })

  describe('directories = ["abc", "ghi"]', () => {
    const directories = ['abc', 'ghi']

    it('calls console.info several times', async () => {
      const { info } = await setup(directories)
      expect(info.mock.calls).toMatchSnapshot()
    })

    it('does not call console.error', async () => {
      const { error } = await setup(directories)
      expect(error).not.toBeCalled()
    })

    it('calls process.exit once', async () => {
      const { exit } = await setup(directories)
      expect(exit).toBeCalledTimes(1)
    })

    it('calls process.exit with ExitStatus.Success', async () => {
      const { exit } = await setup(directories)
      expect(exit).toBeCalledWith(ExitStatus.Success)
    })

    it('resulting filesystem matches snapshot', async () => {
      await setup(directories)
      expect(getFilesystemSnapshot()).toMatchSnapshot()
    })
  })
})

describe('knownMjsPackages = undefined', () => {
  async function setup (directories: readonly string[]) {
    const info = jest.fn()
    const error = jest.fn()
    const exit = jest.fn()
    makeValidFiles()
    await main({
      directories,
      console: { info, error },
      process: { exit }
    })
    return { info, error, exit }
  }

  describe('directories = []', () => {
    const directories = [] as const

    it('does not call console.info', async () => {
      const { info } = await setup(directories)
      expect(info).not.toBeCalled()
    })

    it('calls console.error once', async () => {
      const { error } = await setup(directories)
      expect(error).toBeCalledTimes(1)
    })

    it('calls console.error with expected arguments', async () => {
      const { error } = await setup(directories)
      expect(error).toBeCalledWith('ERROR: Directory list is empty')
    })

    it('calls process.exit once', async () => {
      const { exit } = await setup(directories)
      expect(exit).toBeCalledTimes(1)
    })

    it('calls process.exit with ExitStatus.NoDirectory', async () => {
      const { exit } = await setup(directories)
      expect(exit).toBeCalledWith(ExitStatus.NoDirectory)
    })
  })

  describe('directories = [""]', () => {
    const directories = ['']

    it('calls console.info several times', async () => {
      const { info } = await setup(directories)
      expect(info.mock.calls).toMatchSnapshot()
    })

    it('does not call console.error', async () => {
      const { error } = await setup(directories)
      expect(error).not.toBeCalled()
    })

    it('calls process.exit once', async () => {
      const { exit } = await setup(directories)
      expect(exit).toBeCalledTimes(1)
    })

    it('calls process.exit with ExitStatus.Success', async () => {
      const { exit } = await setup(directories)
      expect(exit).toBeCalledWith(ExitStatus.Success)
    })

    it('resulting filesystem matches snapshot', async () => {
      await setup(directories)
      expect(getFilesystemSnapshot()).toMatchSnapshot()
    })
  })

  describe('directories = ["abc", "ghi"]', () => {
    const directories = ['abc', 'ghi']

    it('calls console.info several times', async () => {
      const { info } = await setup(directories)
      expect(info.mock.calls).toMatchSnapshot()
    })

    it('does not call console.error', async () => {
      const { error } = await setup(directories)
      expect(error).not.toBeCalled()
    })

    it('calls process.exit once', async () => {
      const { exit } = await setup(directories)
      expect(exit).toBeCalledTimes(1)
    })

    it('calls process.exit with ExitStatus.Success', async () => {
      const { exit } = await setup(directories)
      expect(exit).toBeCalledWith(ExitStatus.Success)
    })

    it('resulting filesystem matches snapshot', async () => {
      await setup(directories)
      expect(getFilesystemSnapshot()).toMatchSnapshot()
    })
  })
})
