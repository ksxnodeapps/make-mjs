import assert from 'static-type-assert'

import {
  ModulePathResolver,
  ModulePathTester,
  DEFAULT_FILE_PATH_RESOLVER,
  DEFAULT_DIR_PATH_RESOLVER,
  DEFAULT_INTERNAL_MODULE_TESTER,
  DEFAULT_MJS_PATH_TESTER
} from '@make-mjs/mjs-path'

assert<ModulePathResolver>(
  DEFAULT_DIR_PATH_RESOLVER,
  DEFAULT_FILE_PATH_RESOLVER
)

assert<ModulePathTester>(
  DEFAULT_INTERNAL_MODULE_TESTER,
  DEFAULT_MJS_PATH_TESTER
)
