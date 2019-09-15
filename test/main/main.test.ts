import path from 'path'
import yaml from 'js-yaml'
import { formatCode } from '@tools/test-utils'
import { main } from '@make-mjs/main'

import {
  files,
  directories,
  manifestFiles,
  textFiles,
  emptyAll,
  fillAll,
  appendFileSystem
} from './fsx-mocks'
import { allThatIs } from '../file/fsx-mocks'

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

const oldSep = path.sep

beforeEach(() => {
  // @ts-ignore
  path.sep = '/'
})

afterEach(() => {
  fillAll()
  // @ts-ignore
  path.sep = oldSep
})

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

describe('without isMjsPackage', () => {
  async function setup (dirname: string) {
    makeValidFiles()
    const events = []
    for await (const event of main({ dirname })) {
      events.push(event)
    }
    return { events }
  }

  describe('dirname = ""', () => {
    const dirname = ''

    it('resulting filesystem matches snapshot', async () => {
      await setup(dirname)
      expect(getFilesystemSnapshot()).toMatchSnapshot()
    })

    it('events matches snapshot', async () => {
      const { events } = await setup(dirname)
      expect(events).toMatchSnapshot()
    })
  })

  describe('dirname = "abc/def"', () => {
    const dirname = 'abc/def'

    it('resulting filesystem matches snapshot', async () => {
      await setup(dirname)
      expect(getFilesystemSnapshot()).toMatchSnapshot()
    })

    it('events matches snapshot', async () => {
      const { events } = await setup(dirname)
      expect(events).toMatchSnapshot()
    })

    it('new file is added to [dirname]', async () => {
      await setup(dirname)
      expect(
        formatCode(textFiles.get().get('abc/def/ghi/jkl/deep-file-0.mjs')!)
      ).toBe(formatCode(`
        export async function main() {
          await import('deep-external/deep-module-entry.mjs')
          await import('external-nonmjs-nonmjs')
          await import('external-nonmjs-mjs')
          await import('external-mjs-main/mjs-entry.mjs')
          await import('@scope/foo/scope-module-entry.mjs')
        }
      `))
    })

    it('no file is added outside of [dirname]', async () => {
      await setup(dirname)
      expect(allThatIs.get()).not.toContain('ghi/deep-file-1.mjs')
    })
  })

  describe('dirname = "ghi"', () => {
    const dirname = 'ghi'

    it('resulting filesystem matches snapshot', async () => {
      await setup(dirname)
      expect(getFilesystemSnapshot()).toMatchSnapshot()
    })

    it('events matches snapshot', async () => {
      const { events } = await setup(dirname)
      expect(events).toMatchSnapshot()
    })

    it('new file is added to [dirname]', async () => {
      await setup(dirname)
      expect(
        formatCode(textFiles.get().get('ghi/deep-file-1.mjs')!)
      ).toBe(formatCode(`
        export * from 'deep-external/deep-browser-entry.mjs'
        export * from '@scope/foo/deep-scope-foo-main-entry.mjs'
      `))
    })

    it('no file is added outside of [dirname]', async () => {
      await setup(dirname)
      expect(allThatIs.get()).not.toContain('abc/def/ghi/jkl/deep-file-0.mjs')
    })
  })
})

describe('with isMjsPackage that classifies "external-nonmjs-mjs" as an mjs package', () => {
  async function setup (dirname: string) {
    makeValidFiles()
    const events = []
    const eventGenerator = main({
      dirname,
      codeTransformOptions: {
        isMjsPackage: param => param.packageName === 'external-nonmjs-mjs'
      }
    })
    for await (const event of eventGenerator) {
      events.push(event)
    }
    return { events }
  }

  describe('dirname = ""', () => {
    const dirname = ''

    it('resulting filesystem matches snapshot', async () => {
      await setup(dirname)
      expect(getFilesystemSnapshot()).toMatchSnapshot()
    })

    it('events matches snapshot', async () => {
      const { events } = await setup(dirname)
      expect(events).toMatchSnapshot()
    })
  })

  describe('dirname = "abc/def"', () => {
    const dirname = 'abc/def'

    it('resulting filesystem matches snapshot', async () => {
      await setup(dirname)
      expect(getFilesystemSnapshot()).toMatchSnapshot()
    })

    it('events matches snapshot', async () => {
      const { events } = await setup(dirname)
      expect(events).toMatchSnapshot()
    })

    it('new file is added to [dirname]', async () => {
      await setup(dirname)
      expect(
        formatCode(textFiles.get().get('abc/def/ghi/jkl/deep-file-0.mjs')!)
      ).toBe(formatCode(`
        export async function main() {
          await import('deep-external/deep-module-entry.mjs')
          await import('external-nonmjs-nonmjs')
          await import('external-nonmjs-mjs/nonmjs-mjs-entry.mjs')
          await import('external-mjs-main/mjs-entry.mjs')
          await import('@scope/foo/scope-module-entry.mjs')
        }
      `))
    })

    it('no file is added outside of [dirname]', async () => {
      await setup(dirname)
      expect(allThatIs.get()).not.toContain('ghi/deep-file-1.mjs')
    })
  })

  describe('dirname = "ghi"', () => {
    const dirname = 'ghi'

    it('resulting filesystem matches snapshot', async () => {
      await setup(dirname)
      expect(getFilesystemSnapshot()).toMatchSnapshot()
    })

    it('events matches snapshot', async () => {
      const { events } = await setup(dirname)
      expect(events).toMatchSnapshot()
    })

    it('new file is added to [dirname]', async () => {
      await setup(dirname)
      expect(
        formatCode(textFiles.get().get('ghi/deep-file-1.mjs')!)
      ).toBe(formatCode(`
        export * from 'deep-external/deep-browser-entry.mjs'
        export * from '@scope/foo/deep-scope-foo-main-entry.mjs'
      `))
    })

    it('no file is added outside of [dirname]', async () => {
      await setup(dirname)
      expect(allThatIs.get()).not.toContain('abc/def/ghi/jkl/deep-file-0.mjs')
    })
  })
})
