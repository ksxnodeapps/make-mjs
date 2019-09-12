import { transformCode } from '@make-mjs/mjs-file'
import { formatCode } from './eslint'

import {
  fillAll,
  emptyAll,
  appendFile,
  appendDir,
  appendManifest
} from './fsx-mocks'

beforeEach(() => {
  emptyAll()

  appendDir([
    './internal-dir',

    'node_modules',

    'node_modules/nonmjs-external',
    'node_modules/nonmjs-external/dir-without-manifest',
    'node_modules/nonmjs-external/dir-with-manifest',

    'node_modules/external-default',
    'node_modules/external-default/dir-without-manifest',
    'node_modules/external-default/dir-with-manifest',

    'node_modules/external-main',
    'node_modules/external-main/dir-without-manifest',
    'node_modules/external-main/dir-with-manifest',

    'node_modules/external-browser',
    'node_modules/external-browser/dir-without-manifest',
    'node_modules/external-browser/dir-with-manifest',

    'node_modules/external-module',
    'node_modules/external-module/dir-without-manifest',
    'node_modules/external-module/dir-with-manifest'
  ])

  appendFile([
    './internal-file.mjs',
    './internal-dir/index.mjs',

    'node_modules/nonmjs-external/index.js',
    'node_modules/external-default/index.mjs',
    'node_modules/external-main/index.mjs',
    'node_modules/external-browser/index.mjs',
    'node_modules/external-module/index.mjs',

    'node_modules/nonmjs-external/file.js',
    'node_modules/external-default/file.mjs',
    'node_modules/external-main/file.mjs',
    'node_modules/external-browser/file.mjs',
    'node_modules/external-module/file.mjs',

    'node_modules/external-main/main-entry.js',
    'node_modules/external-main/main-entry.mjs',
    'node_modules/external-browser/browser-entry',
    'node_modules/external-module/module-entry',

    'node_modules/external-main/dir-with-manifest/dir-main-entry.js',
    'node_modules/external-main/dir-with-manifest/dir-main-entry.mjs',
    'node_modules/external-browser/dir-with-manifest/dir-browser-entry',
    'node_modules/external-module/dir-with-manifest/dir-module-entry'
  ])

  appendManifest([
    ['package.json', {}],

    ['node_modules/nonmjs-external/package.json', {}],
    ['node_modules/external-default/package.json', {}],
    ['node_modules/external-main/package.json', { main: 'main-entry.js' }],
    ['node_modules/external-browser/package.json', { browser: 'browser-entry' }],
    ['node_modules/external-module/package.json', { browser: 'module-entry' }],

    ['node_modules/nonmjs-external/dir-with-manifest/package.json', {}],
    ['node_modules/external-default/dir-with-manifest/package.json', {}],
    ['node_modules/external-main/dir-with-manifest/package.json', { main: 'dir-main-entry.js' }],
    ['node_modules/external-browser/dir-with-manifest/package.json', { browser: 'dir-browser-entry' }],
    ['node_modules/external-module/dir-with-manifest/package.json', { browser: 'dir-module-entry' }]
  ])
})

afterEach(fillAll)

describe('without isMjsPackage', () => {
  const code = `
    import './internal-file'
    import './internal-dir'

    import 'nonmjs-external'
    import 'nonmjs-external/dir-without-manifest'
    import 'nonmjs-external/dir-with-manifest'
    import 'nonmjs-external/file'

    import 'external-default/index.mjs'
    import 'external-default/dir-without-manifest'
    import 'external-default/dir-with-manifest'
    import 'external-default/file'

    import 'external-main'
    import 'external-main/dir-without-manifest'
    import 'external-main/dir-with-manifest'
    import 'external-main/file'

    import 'external-browser'
    import 'external-browser/dir-without-manifest'
    import 'external-browser/dir-with-manifest'
    import 'external-browser/file'

    import 'external-module'
    import 'external-module/dir-without-manifest'
    import 'external-module/dir-with-manifest'
    import 'external-module/file'

    export * from './internal-file'
    export * from 'external-module'
    export { default } from './internal-dir'

    export async function main () {
      const a = await import('./internal-file')
      const b = await import('external-module')
      return [a, b]
    }
  `

  it('matches snapshot', async () => {
    const result = await transformCode(code, {
      moduleContainer: 'node_modules'
    })

    expect(formatCode(result.code)).toMatchSnapshot()
  })

  it('returns expected code', async () => {
    const expectedCode = formatCode(`
      import './internal-file.mjs'
      import './internal-dir/index.mjs'

      import 'nonmjs-external'
      import 'nonmjs-external/dir-without-manifest'
      import 'nonmjs-external/dir-with-manifest'
      import 'nonmjs-external/file'

      import 'external-default/index.mjs'
      import 'external-default/dir-without-manifest'
      import 'external-default/dir-with-manifest'
      import 'external-default/file.mjs'

      import 'external-main/main-entry.mjs'
      import 'external-main/dir-without-manifest'
      import 'external-main/dir-with-manifest/dir-main-entry.mjs'
      import 'external-main/file.mjs'

      import 'external-browser/browser-entry'
      import 'external-browser/dir-without-manifest'
      import 'external-browser/dir-with-manifest/dir-browser-entry'
      import 'external-browser/file.mjs'

      import 'external-module/module-entry'
      import 'external-module/dir-without-manifest'
      import 'external-module/dir-with-manifest/dir-module-entry'
      import 'external-module/file.mjs'

      export * from './internal-file.mjs'
      export * from 'external-module/module-entry'
      export { default } from './internal-dir/index.mjs'

      export async function main () {
        const a = await import('./internal-file.mjs')
        const b = await import('external-module/module-entry')
        return [a, b]
      }
    `)

    const result = await transformCode(code, {
      moduleContainer: 'node_modules'
    })

    expect(formatCode(result.code)).toBe(expectedCode)
  })
})
