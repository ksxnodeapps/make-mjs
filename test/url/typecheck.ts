import assert from 'static-type-assert'

import {
  ModuleUrlResolver,
  ModuleUrlTester,
  MjsPackageTester,
  DEFAULT_FILE_URL_RESOLVER,
  DEFAULT_DIR_URL_RESOLVER,
  DEFAULT_INTERNAL_MODULE_TESTER,
  DEFAULT_MJS_URL_TESTER,
  DEFAULT_MJS_PACKAGE_TESTER
} from '@make-mjs/url'

assert<ModuleUrlResolver>(
  DEFAULT_DIR_URL_RESOLVER,
  DEFAULT_FILE_URL_RESOLVER
)

assert<ModuleUrlTester>(
  DEFAULT_INTERNAL_MODULE_TESTER,
  DEFAULT_MJS_URL_TESTER
)

assert<MjsPackageTester>(DEFAULT_MJS_PACKAGE_TESTER)
