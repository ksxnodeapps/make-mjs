import { joinUrl } from '@make-mjs/utils'

export const MODULE_CONTAINER = 'node_modules'
export const ENTRY_MODULE = 'entry-module'
export const ENTRY_MAIN = 'entry-main'
export const ENTRY_MAIN_JS = 'entry-main.js'
export const ENTRY_MAIN_MJS = 'entry-main.mjs'
export const ENTRY_DEFAULT = 'index'
export const ENTRY_DEFAULT_JS = 'index.js'
export const ENTRY_DEFAULT_MJS = 'index.mjs'

export const INTERNAL_FILE_MODULE_PATH = './file-module'
export const INTERNAL_FILE_MODULE_PATH_JS = './file-module.js'
export const INTERNAL_FILE_MODULE_PATH_MJS = './file-module.mjs'
export const INTERNAL_DIR_MODULE_PATH = './dir-module'
export const INTERNAL_FILE_MODULE_PATH_SUPER = '../file-module'
export const INTERNAL_FILE_MODULE_PATH_JS_SUPER = '../file-module.js'
export const INTERNAL_FILE_MODULE_PATH_MJS_SUPER = '../file-module.mjs'
export const INTERNAL_DIR_MODULE_PATH_SUPER = '../dir-module'
export const INTERNAL_FILE_MODULE_PATH_NOT_EXIST = './file-module-not-exist'
export const INTERNAL_FILE_MODULE_PATH_NOT_EXIST_JS = './file-module-not-exist.js'
export const INTERNAL_FILE_MODULE_PATH_NOT_EXIST_MJS = './file-module-not-exist.mjs'
export const INTERNAL_FILE_MODULE_PATH_NOT_EXIST_SUPER = '../file-module-not-exist'
export const INTERNAL_FILE_MODULE_PATH_NOT_EXIST_JS_SUPER = '../file-module-not-exist.js'
export const INTERNAL_FILE_MODULE_PATH_NOT_EXIST_MJS_SUPER = '../file-module-not-exist.mjs'
export const INTERNAL_NOT_FILE_NOR_DIR = './not-file-nor-dir'

export const EXTERNAL_MODULE_NAME = 'external-module'
export const EXTERNAL_MODULE_PATH = joinUrl(MODULE_CONTAINER, EXTERNAL_MODULE_NAME)
export const EXTERNAL_MODULE_ENTRY = joinUrl(EXTERNAL_MODULE_PATH, 'index.js')
export const EXTERNAL_MODULE_ENTRY_MJS = joinUrl(EXTERNAL_MODULE_PATH, 'index.mjs')

export const EXTERNAL_MODULE_NAME_MODULE = 'external-module-with-module-field'
export const EXTERNAL_MODULE_PATH_MODULE = joinUrl(MODULE_CONTAINER, EXTERNAL_MODULE_NAME_MODULE)
export const EXTERNAL_MODULE_MANIFEST_MODULE = joinUrl(EXTERNAL_MODULE_PATH_MODULE, 'package.json')
export const EXTERNAL_MODULE_ENTRY_MODULE = joinUrl(EXTERNAL_MODULE_PATH_MODULE, ENTRY_MODULE)

export const EXTERNAL_MODULE_NAME_MAIN = 'external-module-with-main-field'
export const EXTERNAL_MODULE_PATH_MAIN = joinUrl(MODULE_CONTAINER, EXTERNAL_MODULE_NAME_MAIN)
export const EXTERNAL_MODULE_MANIFEST_MAIN = joinUrl(EXTERNAL_MODULE_PATH_MAIN, 'package.json')
export const EXTERNAL_MODULE_ENTRY_MAIN = joinUrl(EXTERNAL_MODULE_PATH_MAIN, ENTRY_MAIN_JS)
export const EXTERNAL_MODULE_ENTRY_MAIN_MJS = joinUrl(EXTERNAL_MODULE_PATH_MAIN, ENTRY_MAIN_MJS)

export const EXTERNAL_MODULE_NAME_DEFAULT = 'external-module-with-default-entry'
export const EXTERNAL_MODULE_PATH_DEFAULT = joinUrl(MODULE_CONTAINER, EXTERNAL_MODULE_NAME_DEFAULT)
export const EXTERNAL_MODULE_MANIFEST_DEFAULT = joinUrl(EXTERNAL_MODULE_PATH_DEFAULT, 'package.json')
export const EXTERNAL_MODULE_ENTRY_DEFAULT = joinUrl(EXTERNAL_MODULE_PATH_DEFAULT, ENTRY_DEFAULT_JS)
export const EXTERNAL_MODULE_ENTRY_DEFAULT_MJS = joinUrl(EXTERNAL_MODULE_PATH_DEFAULT, ENTRY_DEFAULT_MJS)

export const EXTERNAL_MODULE_NAME_NONMJS = 'external-module-without-mjs'
export const EXTERNAL_MODULE_PATH_NONMJS = joinUrl(MODULE_CONTAINER, EXTERNAL_MODULE_NAME_NONMJS)
export const EXTERNAL_MODULE_MANIFEST_NONMJS = joinUrl(EXTERNAL_MODULE_PATH_NONMJS, 'package.json')
export const EXTERNAL_MODULE_ENTRY_NONMJS = joinUrl(EXTERNAL_MODULE_PATH_NONMJS, ENTRY_MAIN_JS)
export const EXTERNAL_MODULE_ENTRY_NONMJS_MJS = joinUrl(EXTERNAL_MODULE_PATH_NONMJS, ENTRY_MAIN_JS)
