import { joinUrl } from '@make-mjs/utils'
import { getMjsUrl } from '@make-mjs/url'

import {
  MODULE_CONTAINER,
  INTERNAL_DIR_MODULE_PATH,
  INTERNAL_DIR_MODULE_PATH_SUPER,
  INTERNAL_FILE_MODULE_PATH,
  INTERNAL_FILE_MODULE_PATH_JS,
  INTERNAL_FILE_MODULE_PATH_MJS,
  INTERNAL_FILE_MODULE_PATH_SUPER,
  INTERNAL_FILE_MODULE_PATH_JS_SUPER,
  INTERNAL_FILE_MODULE_PATH_MJS_SUPER,
  INTERNAL_FILE_MODULE_PATH_NOT_EXIST,
  INTERNAL_FILE_MODULE_PATH_NOT_EXIST_JS,
  INTERNAL_FILE_MODULE_PATH_NOT_EXIST_MJS,
  INTERNAL_FILE_MODULE_PATH_NOT_EXIST_SUPER,
  INTERNAL_FILE_MODULE_PATH_NOT_EXIST_JS_SUPER,
  INTERNAL_FILE_MODULE_PATH_NOT_EXIST_MJS_SUPER,
  INTERNAL_NOT_FILE_NOR_DIR,
  EXTERNAL_MODULE_NAME,
  EXTERNAL_MODULE_NAME_MODULE,
  EXTERNAL_MODULE_NAME_BROWSER,
  EXTERNAL_MODULE_NAME_MAIN,
  EXTERNAL_MODULE_NAME_DEFAULT,
  pathExists,
  readJSON,
  fillAllMockedArrays,
  filterFiles,
  appendFile
} from './fsx-mocks'

const excludeMjs = (name: string) => !name.endsWith('.mjs')
const removeMjsFromFiles = () => filterFiles(excludeMjs)

const get = (modulePath: string) =>
  getMjsUrl({ modulePath, moduleContainer: [MODULE_CONTAINER] })

describe('internal module', () => {
  describe('directory: append "/index.mjs"', () => {
    it('"./<name>"', async () => {
      expect(await get(INTERNAL_DIR_MODULE_PATH))
        .toBe(INTERNAL_DIR_MODULE_PATH + '/index.mjs')
    })

    it('"../<name>"', async () => {
      expect(await get(INTERNAL_DIR_MODULE_PATH_SUPER))
        .toBe(INTERNAL_DIR_MODULE_PATH_SUPER + '/index.mjs')
    })
  })

  describe('file: change extension to ".mjs"', () => {
    describe('"./<name>"', () => {
      it('without extension', async () => {
        expect(await get(INTERNAL_FILE_MODULE_PATH))
          .toBe(INTERNAL_FILE_MODULE_PATH + '.mjs')
      })

      it('with ".js" extension', async () => {
        expect(await get(INTERNAL_FILE_MODULE_PATH_JS))
          .toBe(INTERNAL_FILE_MODULE_PATH_JS.replace('.js', '.mjs'))
      })

      it('with ".mjs" extension', async () => {
        expect(await get(INTERNAL_FILE_MODULE_PATH_MJS))
          .toBe(INTERNAL_FILE_MODULE_PATH_MJS)
      })
    })

    describe('"../<name>"', () => {
      it('without extension', async () => {
        expect(await get(INTERNAL_FILE_MODULE_PATH_SUPER))
          .toBe(INTERNAL_FILE_MODULE_PATH_SUPER + '.mjs')
      })

      it('with ".js" extension', async () => {
        expect(await get(INTERNAL_FILE_MODULE_PATH_JS_SUPER))
          .toBe(INTERNAL_FILE_MODULE_PATH_JS_SUPER.replace('.js', '.mjs'))
      })

      it('with ".mjs" extension', async () => {
        expect(await get(INTERNAL_FILE_MODULE_PATH_MJS_SUPER))
          .toBe(INTERNAL_FILE_MODULE_PATH_MJS_SUPER)
      })
    })
  })

  describe('not exist: change extension to ".mjs"', () => {
    describe('"./<name>"', () => {
      it('without extension', async () => {
        expect(await get(INTERNAL_FILE_MODULE_PATH_NOT_EXIST))
          .toBe(INTERNAL_FILE_MODULE_PATH_NOT_EXIST + '.mjs')
      })

      it('with ".js" extension', async () => {
        expect(await get(INTERNAL_FILE_MODULE_PATH_NOT_EXIST_JS))
          .toBe(INTERNAL_FILE_MODULE_PATH_NOT_EXIST_JS.replace('.js', '.mjs'))
      })

      it('with ".mjs" extension', async () => {
        expect(await get(INTERNAL_FILE_MODULE_PATH_NOT_EXIST_MJS))
          .toBe(INTERNAL_FILE_MODULE_PATH_NOT_EXIST_MJS)
      })
    })

    describe('"../<name>"', () => {
      it('without extension', async () => {
        expect(await get(INTERNAL_FILE_MODULE_PATH_NOT_EXIST_SUPER))
          .toBe(INTERNAL_FILE_MODULE_PATH_NOT_EXIST_SUPER + '.mjs')
      })

      it('with ".js" extension', async () => {
        expect(await get(INTERNAL_FILE_MODULE_PATH_NOT_EXIST_JS_SUPER))
          .toBe(INTERNAL_FILE_MODULE_PATH_NOT_EXIST_JS_SUPER.replace('.js', '.mjs'))
      })

      it('with ".mjs" extension', async () => {
        expect(await get(INTERNAL_FILE_MODULE_PATH_NOT_EXIST_MJS_SUPER))
          .toBe(INTERNAL_FILE_MODULE_PATH_NOT_EXIST_MJS_SUPER)
      })
    })
  })
})

describe('external module', () => {
  describe('when every .js file has a .mjs counterpart', () => {
    afterEach(fillAllMockedArrays)

    describe('without "package.json"', () => {
      beforeEach(() => appendFile([
        joinUrl(MODULE_CONTAINER, EXTERNAL_MODULE_NAME, 'target/file.mjs')
      ]))

      it('assertion: "package.json" does not exist', async () => {
        expect(await pathExists(
          joinUrl(MODULE_CONTAINER, EXTERNAL_MODULE_NAME, 'package.json')
        )).toBe(false)
      })

      it('import by module name: append "/index.mjs"', async () => {
        expect(await get(EXTERNAL_MODULE_NAME))
          .toBe(EXTERNAL_MODULE_NAME + '/index.mjs')
      })

      it('import by file without extension: append ".mjs"', async () => {
        expect(await get(EXTERNAL_MODULE_NAME + '/target/file'))
          .toBe(EXTERNAL_MODULE_NAME + '/target/file.mjs')
      })

      it('import by ".js" file: change extension to ".mjs"', async () => {
        expect(await get(EXTERNAL_MODULE_NAME + '/target/file.js'))
          .toBe(EXTERNAL_MODULE_NAME + '/target/file.mjs')
      })

      it('import by ".mjs" file: does not change extension', async () => {
        expect(await get(EXTERNAL_MODULE_NAME + '/target/file.mjs'))
          .toBe(EXTERNAL_MODULE_NAME + '/target/file.mjs')
      })
    })

    describe('"package.json" has a "module" field', () => {
      const manifestContent = readJSON(
        joinUrl(MODULE_CONTAINER, EXTERNAL_MODULE_NAME_MODULE, 'package.json')
      )

      it('assertion: "package.json" has a "module" field', async () => {
        expect(await manifestContent).toHaveProperty('module', expect.any(String))
      })

      it('assertion: "package.json" does not have "browser" field', async () => {
        expect(await manifestContent).not.toHaveProperty('browser')
      })

      it('assertion: "package.json" does not have "main" field', async () => {
        expect(await manifestContent).not.toHaveProperty('main')
      })

      it('import by module name: append entry name', async () => {
        expect(await get(EXTERNAL_MODULE_NAME_MODULE))
          .toBe(EXTERNAL_MODULE_NAME_MODULE + '/' + (await manifestContent).module)
      })

      it('import by file without extension: append ".mjs"', async () => {
        appendFile([
          joinUrl(MODULE_CONTAINER, EXTERNAL_MODULE_NAME_MODULE, 'target/file.mjs')
        ])

        expect(await get(EXTERNAL_MODULE_NAME_MODULE + '/target/file'))
          .toBe(EXTERNAL_MODULE_NAME_MODULE + '/target/file.mjs')
      })

      it('import by ".js" file: change extension to ".mjs"', async () => {
        appendFile([
          joinUrl(MODULE_CONTAINER, EXTERNAL_MODULE_NAME_MODULE, 'target/file.mjs')
        ])

        expect(await get(EXTERNAL_MODULE_NAME_MODULE + '/target/file.js'))
          .toBe(EXTERNAL_MODULE_NAME_MODULE + '/target/file.mjs')
      })

      it('import by ".mjs" file: does not change extension', async () => {
        expect(await get(EXTERNAL_MODULE_NAME_MODULE + '/target/file.mjs'))
          .toBe(EXTERNAL_MODULE_NAME_MODULE + '/target/file.mjs')
      })
    })

    describe('"package.json" has a "browser" field', () => {
      const manifestContent = readJSON(
        joinUrl(MODULE_CONTAINER, EXTERNAL_MODULE_NAME_BROWSER, 'package.json')
      )

      it('assertion: "package.json" does not have "module" field', async () => {
        expect(await manifestContent).not.toHaveProperty('module')
      })

      it('assertion: "package.json" has a "browser" field', async () => {
        expect(await manifestContent).toHaveProperty('browser', expect.any(String))
      })

      it('assertion: "package.json" does not have "main" field', async () => {
        expect(await manifestContent).not.toHaveProperty('main')
      })

      it('import by module name: append entry name', async () => {
        expect(await get(EXTERNAL_MODULE_NAME_BROWSER))
          .toBe(EXTERNAL_MODULE_NAME_BROWSER + '/' + (await manifestContent).browser)
      })

      it('import by file without extension: append ".mjs"', async () => {
        appendFile([
          joinUrl(MODULE_CONTAINER, EXTERNAL_MODULE_NAME_BROWSER, 'target/file.mjs')
        ])

        expect(await get(EXTERNAL_MODULE_NAME_BROWSER + '/target/file'))
          .toBe(EXTERNAL_MODULE_NAME_BROWSER + '/target/file.mjs')
      })

      it('import by ".js" file: change extension to ".mjs"', async () => {
        appendFile([
          joinUrl(MODULE_CONTAINER, EXTERNAL_MODULE_NAME_BROWSER, 'target/file.mjs')
        ])

        expect(await get(EXTERNAL_MODULE_NAME_BROWSER + '/target/file.js'))
          .toBe(EXTERNAL_MODULE_NAME_BROWSER + '/target/file.mjs')
      })

      it('import by ".mjs" file: does not change extension', async () => {
        expect(await get(EXTERNAL_MODULE_NAME_BROWSER + '/target/file.mjs'))
          .toBe(EXTERNAL_MODULE_NAME_BROWSER + '/target/file.mjs')
      })
    })

    describe('"package.json" has a "main" field', () => {
      const manifestContent = readJSON(
        joinUrl(MODULE_CONTAINER, EXTERNAL_MODULE_NAME_MAIN, 'package.json')
      )

      it('assertion: "package.json" does not have "module" field', async () => {
        expect(await manifestContent).not.toHaveProperty('module')
      })

      it('assertion: "package.json" does not have "browser" field', async () => {
        expect(await manifestContent).not.toHaveProperty('browser')
      })

      it('assertion: "package.json" has a "main" field', async () => {
        expect(await manifestContent).toHaveProperty('main', expect.any(String))
      })

      it('import by main name: append entry name', async () => {
        expect(await get(EXTERNAL_MODULE_NAME_MAIN))
          .toBe(EXTERNAL_MODULE_NAME_MAIN + '/' + (await manifestContent).main!.replace('.js', '.mjs'))
      })

      it('import by file without extension: append ".mjs"', async () => {
        appendFile([
          joinUrl(MODULE_CONTAINER, EXTERNAL_MODULE_NAME_MAIN, 'target/file.mjs')
        ])

        expect(await get(EXTERNAL_MODULE_NAME_MAIN + '/target/file'))
          .toBe(EXTERNAL_MODULE_NAME_MAIN + '/target/file.mjs')
      })

      it('import by ".js" file: change extension to ".mjs"', async () => {
        appendFile([
          joinUrl(MODULE_CONTAINER, EXTERNAL_MODULE_NAME_MAIN, 'target/file.mjs')
        ])

        expect(await get(EXTERNAL_MODULE_NAME_MAIN + '/target/file.js'))
          .toBe(EXTERNAL_MODULE_NAME_MAIN + '/target/file.mjs')
      })

      it('import by ".mjs" file: does not change extension', async () => {
        expect(await get(EXTERNAL_MODULE_NAME_MAIN + '/target/file.mjs'))
          .toBe(EXTERNAL_MODULE_NAME_MAIN + '/target/file.mjs')
      })
    })

    describe('"package.json" has neither "module" nor "browser" nor "main"', () => {
      const manifestContent = readJSON(
        joinUrl(MODULE_CONTAINER, EXTERNAL_MODULE_NAME_DEFAULT, 'package.json')
      )

      it('assertion: "package.json" does not have "module" field', async () => {
        expect(await manifestContent).not.toHaveProperty('module')
      })

      it('assertion: "package.json" does not have "browser" field', async () => {
        expect(await manifestContent).not.toHaveProperty('browser')
      })

      it('assertion: "package.json" does not have "main" field', async () => {
        expect(await manifestContent).not.toHaveProperty('main')
      })

      it('import by main name: append "index.mjs"', async () => {
        expect(await get(EXTERNAL_MODULE_NAME_DEFAULT))
          .toBe(EXTERNAL_MODULE_NAME_DEFAULT + '/index.mjs')
      })

      it('import by file without extension: append ".mjs"', async () => {
        appendFile([
          joinUrl(MODULE_CONTAINER, EXTERNAL_MODULE_NAME_DEFAULT, 'target/file.mjs')
        ])

        expect(await get(EXTERNAL_MODULE_NAME_DEFAULT + '/target/file'))
          .toBe(EXTERNAL_MODULE_NAME_DEFAULT + '/target/file.mjs')
      })

      it('import by ".js" file: change extension to ".mjs"', async () => {
        appendFile([
          joinUrl(MODULE_CONTAINER, EXTERNAL_MODULE_NAME_DEFAULT, 'target/file.mjs')
        ])

        expect(await get(EXTERNAL_MODULE_NAME_DEFAULT + '/target/file.js'))
          .toBe(EXTERNAL_MODULE_NAME_DEFAULT + '/target/file.mjs')
      })

      it('import by ".mjs" file: does not change extension', async () => {
        expect(await get(EXTERNAL_MODULE_NAME_DEFAULT + '/target/file.mjs'))
          .toBe(EXTERNAL_MODULE_NAME_DEFAULT + '/target/file.mjs')
      })
    })
  })

  describe('when no .mjs file exist and isMjsPackage always returns false', () => {
    beforeEach(removeMjsFromFiles)
    afterEach(fillAllMockedArrays)

    describe('without "package.json"', () => {
      it('assertion: "package.json" does not exist', async () => {
        expect(await pathExists(
          joinUrl(MODULE_CONTAINER, EXTERNAL_MODULE_NAME, 'package.json')
        )).toBe(false)
      })

      it('import by module name: change nothing', async () => {
        expect(await get(EXTERNAL_MODULE_NAME))
          .toBe(EXTERNAL_MODULE_NAME)
      })

      it('import by file without extension: change nothing', async () => {
        expect(await get(EXTERNAL_MODULE_NAME + '/target/file'))
          .toBe(EXTERNAL_MODULE_NAME + '/target/file')
      })

      it('import by ".js" file: change nothing', async () => {
        expect(await get(EXTERNAL_MODULE_NAME + '/target/file.js'))
          .toBe(EXTERNAL_MODULE_NAME + '/target/file.js')
      })

      it('import by ".mjs" file: change nothing', async () => {
        expect(await get(EXTERNAL_MODULE_NAME + '/target/file.mjs'))
          .toBe(EXTERNAL_MODULE_NAME + '/target/file.mjs')
      })
    })

    describe('"package.json" has a "module" field', () => {
      const manifestContent = readJSON(
        joinUrl(MODULE_CONTAINER, EXTERNAL_MODULE_NAME_MODULE, 'package.json')
      )

      it('assertion: "package.json" has a "module" field', async () => {
        expect(await manifestContent).toHaveProperty('module', expect.any(String))
      })

      it('assertion: "package.json" does not have "browser" field', async () => {
        expect(await manifestContent).not.toHaveProperty('browser')
      })

      it('assertion: "package.json" does not have "main" field', async () => {
        expect(await manifestContent).not.toHaveProperty('main')
      })

      it('import by module name: append entry name', async () => {
        expect(await get(EXTERNAL_MODULE_NAME_MODULE))
          .toBe(EXTERNAL_MODULE_NAME_MODULE + '/' + (await manifestContent).module)
      })

      it('import by file without extension: change nothing', async () => {
        expect(await get(EXTERNAL_MODULE_NAME_MODULE + '/target/file'))
          .toBe(EXTERNAL_MODULE_NAME_MODULE + '/target/file')
      })

      it('import by ".js" file: change nothing', async () => {
        expect(await get(EXTERNAL_MODULE_NAME_MODULE + '/target/file.js'))
          .toBe(EXTERNAL_MODULE_NAME_MODULE + '/target/file.js')
      })

      it('import by ".mjs" file: change nothing', async () => {
        expect(await get(EXTERNAL_MODULE_NAME_MODULE + '/target/file.mjs'))
          .toBe(EXTERNAL_MODULE_NAME_MODULE + '/target/file.mjs')
      })
    })

    describe('"package.json" has a "browser" field', () => {
      const manifestContent = readJSON(
        joinUrl(MODULE_CONTAINER, EXTERNAL_MODULE_NAME_BROWSER, 'package.json')
      )

      it('assertion: "package.json" does not have "module" field', async () => {
        expect(await manifestContent).not.toHaveProperty('module')
      })

      it('assertion: "package.json" has a "browser" field', async () => {
        expect(await manifestContent).toHaveProperty('browser', expect.any(String))
      })

      it('assertion: "package.json" does not have "main" field', async () => {
        expect(await manifestContent).not.toHaveProperty('main')
      })

      it('import by module name: append entry name', async () => {
        expect(await get(EXTERNAL_MODULE_NAME_BROWSER))
          .toBe(EXTERNAL_MODULE_NAME_BROWSER + '/' + (await manifestContent).browser)
      })

      it('import by file without extension: change nothing', async () => {
        expect(await get(EXTERNAL_MODULE_NAME_BROWSER + '/target/file'))
          .toBe(EXTERNAL_MODULE_NAME_BROWSER + '/target/file')
      })

      it('import by ".js" file: change nothing', async () => {
        expect(await get(EXTERNAL_MODULE_NAME_BROWSER + '/target/file.js'))
          .toBe(EXTERNAL_MODULE_NAME_BROWSER + '/target/file.js')
      })

      it('import by ".mjs" file: change nothing', async () => {
        expect(await get(EXTERNAL_MODULE_NAME_BROWSER + '/target/file.mjs'))
          .toBe(EXTERNAL_MODULE_NAME_BROWSER + '/target/file.mjs')
      })
    })

    describe('"package.json" has a "main" field', () => {
      const manifestContent = readJSON(
        joinUrl(MODULE_CONTAINER, EXTERNAL_MODULE_NAME_MAIN, 'package.json')
      )

      it('assertion: "package.json" does not have "module" field', async () => {
        expect(await manifestContent).not.toHaveProperty('module')
      })

      it('assertion: "package.json" does not have "browser" field', async () => {
        expect(await manifestContent).not.toHaveProperty('browser')
      })

      it('assertion: "package.json" has a "main" field', async () => {
        expect(await manifestContent).toHaveProperty('main', expect.any(String))
      })

      it('import by main name: change nothing', async () => {
        expect(await get(EXTERNAL_MODULE_NAME_MAIN))
          .toBe(EXTERNAL_MODULE_NAME_MAIN)
      })

      it('import by file without extension: change nothing', async () => {
        expect(await get(EXTERNAL_MODULE_NAME_MAIN + '/target/file'))
          .toBe(EXTERNAL_MODULE_NAME_MAIN + '/target/file')
      })

      it('import by ".js" file: change nothing', async () => {
        expect(await get(EXTERNAL_MODULE_NAME_MAIN + '/target/file.js'))
          .toBe(EXTERNAL_MODULE_NAME_MAIN + '/target/file.js')
      })

      it('import by ".mjs" file: change nothing', async () => {
        expect(await get(EXTERNAL_MODULE_NAME_MAIN + '/target/file.mjs'))
          .toBe(EXTERNAL_MODULE_NAME_MAIN + '/target/file.mjs')
      })
    })

    describe('"package.json" has neither "module" nor "browser" nor "main"', () => {
      const manifestContent = readJSON(
        joinUrl(MODULE_CONTAINER, EXTERNAL_MODULE_NAME_DEFAULT, 'package.json')
      )

      it('assertion: "package.json" does not have "module" field', async () => {
        expect(await manifestContent).not.toHaveProperty('module')
      })

      it('assertion: "package.json" does not have "browser" field', async () => {
        expect(await manifestContent).not.toHaveProperty('browser')
      })

      it('assertion: "package.json" does not have "main" field', async () => {
        expect(await manifestContent).not.toHaveProperty('main')
      })

      it('import by main name: change nothing', async () => {
        expect(await get(EXTERNAL_MODULE_NAME_DEFAULT))
          .toBe(EXTERNAL_MODULE_NAME_DEFAULT)
      })

      it('import by file without extension: change nothing', async () => {
        expect(await get(EXTERNAL_MODULE_NAME_DEFAULT + '/target/file'))
          .toBe(EXTERNAL_MODULE_NAME_DEFAULT + '/target/file')
      })

      it('import by ".js" file: change nothing', async () => {
        expect(await get(EXTERNAL_MODULE_NAME_DEFAULT + '/target/file.js'))
          .toBe(EXTERNAL_MODULE_NAME_DEFAULT + '/target/file.js')
      })

      it('import by ".mjs" file: change nothing', async () => {
        expect(await get(EXTERNAL_MODULE_NAME_DEFAULT + '/target/file.mjs'))
          .toBe(EXTERNAL_MODULE_NAME_DEFAULT + '/target/file.mjs')
      })
    })
  })

  describe('when no .mjs file exist but isMjsPackage always returns true', () => {
    const get = (modulePath: string) =>
      getMjsUrl({ modulePath, moduleContainer: [MODULE_CONTAINER], isMjsPackage: () => true })

    beforeEach(removeMjsFromFiles)
    afterEach(fillAllMockedArrays)

    describe('without "package.json"', () => {
      beforeEach(() => appendFile([
        joinUrl(MODULE_CONTAINER, EXTERNAL_MODULE_NAME, 'target/file.mjs')
      ]))

      it('assertion: "package.json" does not exist', async () => {
        expect(await pathExists(
          joinUrl(MODULE_CONTAINER, EXTERNAL_MODULE_NAME, 'package.json')
        )).toBe(false)
      })

      it('import by module name: append "/index.mjs"', async () => {
        expect(await get(EXTERNAL_MODULE_NAME))
          .toBe(EXTERNAL_MODULE_NAME + '/index.mjs')
      })

      it('import by file without extension: append ".mjs"', async () => {
        expect(await get(EXTERNAL_MODULE_NAME + '/target/file'))
          .toBe(EXTERNAL_MODULE_NAME + '/target/file.mjs')
      })

      it('import by ".js" file: change extension to ".mjs"', async () => {
        expect(await get(EXTERNAL_MODULE_NAME + '/target/file.js'))
          .toBe(EXTERNAL_MODULE_NAME + '/target/file.mjs')
      })

      it('import by ".mjs" file: does not change extension', async () => {
        expect(await get(EXTERNAL_MODULE_NAME + '/target/file.mjs'))
          .toBe(EXTERNAL_MODULE_NAME + '/target/file.mjs')
      })
    })

    describe('"package.json" has a "module" field', () => {
      const manifestContent = readJSON(
        joinUrl(MODULE_CONTAINER, EXTERNAL_MODULE_NAME_MODULE, 'package.json')
      )

      it('assertion: "package.json" has a "module" field', async () => {
        expect(await manifestContent).toHaveProperty('module', expect.any(String))
      })

      it('assertion: "package.json" does not have "browser" field', async () => {
        expect(await manifestContent).not.toHaveProperty('browser')
      })

      it('assertion: "package.json" does not have "main" field', async () => {
        expect(await manifestContent).not.toHaveProperty('main')
      })

      it('import by module name: append entry name', async () => {
        expect(await get(EXTERNAL_MODULE_NAME_MODULE))
          .toBe(EXTERNAL_MODULE_NAME_MODULE + '/' + (await manifestContent).module)
      })

      it('import by file without extension: append ".mjs"', async () => {
        expect(await get(EXTERNAL_MODULE_NAME_MODULE + '/target/file'))
          .toBe(EXTERNAL_MODULE_NAME_MODULE + '/target/file.mjs')
      })

      it('import by ".js" file: change extension to ".mjs"', async () => {
        expect(await get(EXTERNAL_MODULE_NAME_MODULE + '/target/file.js'))
          .toBe(EXTERNAL_MODULE_NAME_MODULE + '/target/file.mjs')
      })

      it('import by ".mjs" file: does not change extension', async () => {
        expect(await get(EXTERNAL_MODULE_NAME_MODULE + '/target/file.mjs'))
          .toBe(EXTERNAL_MODULE_NAME_MODULE + '/target/file.mjs')
      })
    })

    describe('"package.json" has a "browser" field', () => {
      const manifestContent = readJSON(
        joinUrl(MODULE_CONTAINER, EXTERNAL_MODULE_NAME_BROWSER, 'package.json')
      )

      it('assertion: "package.json" does not have "module" field', async () => {
        expect(await manifestContent).not.toHaveProperty('module')
      })

      it('assertion: "package.json" has a "browser" field', async () => {
        expect(await manifestContent).toHaveProperty('browser', expect.any(String))
      })

      it('assertion: "package.json" does not have "main" field', async () => {
        expect(await manifestContent).not.toHaveProperty('main')
      })

      it('import by module name: append entry name', async () => {
        expect(await get(EXTERNAL_MODULE_NAME_BROWSER))
          .toBe(EXTERNAL_MODULE_NAME_BROWSER + '/' + (await manifestContent).browser)
      })

      it('import by file without extension: append ".mjs"', async () => {
        expect(await get(EXTERNAL_MODULE_NAME_BROWSER + '/target/file'))
          .toBe(EXTERNAL_MODULE_NAME_BROWSER + '/target/file.mjs')
      })

      it('import by ".js" file: change extension to ".mjs"', async () => {
        expect(await get(EXTERNAL_MODULE_NAME_BROWSER + '/target/file.js'))
          .toBe(EXTERNAL_MODULE_NAME_BROWSER + '/target/file.mjs')
      })

      it('import by ".mjs" file: does not change extension', async () => {
        expect(await get(EXTERNAL_MODULE_NAME_BROWSER + '/target/file.mjs'))
          .toBe(EXTERNAL_MODULE_NAME_BROWSER + '/target/file.mjs')
      })
    })

    describe('"package.json" has a "main" field', () => {
      const manifestContent = readJSON(
        joinUrl(MODULE_CONTAINER, EXTERNAL_MODULE_NAME_MAIN, 'package.json')
      )

      it('assertion: "package.json" does not have "module" field', async () => {
        expect(await manifestContent).not.toHaveProperty('module')
      })

      it('assertion: "package.json" does not have "browser" field', async () => {
        expect(await manifestContent).not.toHaveProperty('browser')
      })

      it('assertion: "package.json" has a "main" field', async () => {
        expect(await manifestContent).toHaveProperty('main', expect.any(String))
      })

      it('import by main name: append entry name', async () => {
        expect(await get(EXTERNAL_MODULE_NAME_MAIN))
          .toBe(EXTERNAL_MODULE_NAME_MAIN + '/' + (await manifestContent).main!.replace('.js', '.mjs'))
      })

      it('import by file without extension: append ".mjs"', async () => {
        expect(await get(EXTERNAL_MODULE_NAME_MAIN + '/target/file'))
          .toBe(EXTERNAL_MODULE_NAME_MAIN + '/target/file.mjs')
      })

      it('import by ".js" file: change extension to ".mjs"', async () => {
        expect(await get(EXTERNAL_MODULE_NAME_MAIN + '/target/file.js'))
          .toBe(EXTERNAL_MODULE_NAME_MAIN + '/target/file.mjs')
      })

      it('import by ".mjs" file: does not change extension', async () => {
        expect(await get(EXTERNAL_MODULE_NAME_MAIN + '/target/file.mjs'))
          .toBe(EXTERNAL_MODULE_NAME_MAIN + '/target/file.mjs')
      })
    })

    describe('"package.json" has neither "module" nor "browser" nor "main"', () => {
      const manifestContent = readJSON(
        joinUrl(MODULE_CONTAINER, EXTERNAL_MODULE_NAME_DEFAULT, 'package.json')
      )

      it('assertion: "package.json" does not have "module" field', async () => {
        expect(await manifestContent).not.toHaveProperty('module')
      })

      it('assertion: "package.json" does not have "browser" field', async () => {
        expect(await manifestContent).not.toHaveProperty('browser')
      })

      it('assertion: "package.json" does not have "main" field', async () => {
        expect(await manifestContent).not.toHaveProperty('main')
      })

      it('import by main name: append "index.mjs"', async () => {
        expect(await get(EXTERNAL_MODULE_NAME_DEFAULT))
          .toBe(EXTERNAL_MODULE_NAME_DEFAULT + '/index.mjs')
      })

      it('import by file without extension: append ".mjs"', async () => {
        expect(await get(EXTERNAL_MODULE_NAME_DEFAULT + '/target/file'))
          .toBe(EXTERNAL_MODULE_NAME_DEFAULT + '/target/file.mjs')
      })

      it('import by ".js" file: change extension to ".mjs"', async () => {
        expect(await get(EXTERNAL_MODULE_NAME_DEFAULT + '/target/file.js'))
          .toBe(EXTERNAL_MODULE_NAME_DEFAULT + '/target/file.mjs')
      })

      it('import by ".mjs" file: does not change extension', async () => {
        expect(await get(EXTERNAL_MODULE_NAME_DEFAULT + '/target/file.mjs'))
          .toBe(EXTERNAL_MODULE_NAME_DEFAULT + '/target/file.mjs')
      })
    })
  })
})

it('when module is neither a file nor a directory: throw an error', async () => {
  await expect(get(INTERNAL_NOT_FILE_NOR_DIR)).rejects.toMatchSnapshot()
})
