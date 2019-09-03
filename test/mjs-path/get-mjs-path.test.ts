import { joinPath } from '@make-mjs/utils'
import { getMjsPath } from '@make-mjs/mjs-path'

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
  readJSON
} from './fsx-mocks'

const get = (modulePath: string) =>
  getMjsPath({ modulePath, moduleContainer: MODULE_CONTAINER })

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
  describe('without "package.json"', () => {
    it('assertion: "package.json" does not exist', async () => {
      expect(await pathExists(
        joinPath(MODULE_CONTAINER, EXTERNAL_MODULE_NAME, 'package.json')
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
      joinPath(MODULE_CONTAINER, EXTERNAL_MODULE_NAME_MODULE, 'package.json')
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
      joinPath(MODULE_CONTAINER, EXTERNAL_MODULE_NAME_BROWSER, 'package.json')
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
      joinPath(MODULE_CONTAINER, EXTERNAL_MODULE_NAME_MAIN, 'package.json')
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
      joinPath(MODULE_CONTAINER, EXTERNAL_MODULE_NAME_DEFAULT, 'package.json')
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

it('when module is neither a file nor a directory: throw an error', async () => {
  await expect(get(INTERNAL_NOT_FILE_NOR_DIR)).rejects.toMatchSnapshot()
})
