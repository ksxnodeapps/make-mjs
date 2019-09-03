import { fromDir } from '@make-mjs/mjs-path'

import {
  MODULE_CONTAINER,
  ENTRY_DEFAULT_MJS,
  ENTRY_MODULE,
  ENTRY_BROWSER,
  ENTRY_MAIN_MJS,
  EXTERNAL_MODULE_NAME,
  EXTERNAL_MODULE_NAME_DEFAULT,
  EXTERNAL_MODULE_NAME_MODULE,
  EXTERNAL_MODULE_NAME_BROWSER,
  EXTERNAL_MODULE_NAME_MAIN
} from './fsx-mocks'

const get = (modulePath: string) =>
  fromDir({ moduleContainer: MODULE_CONTAINER, modulePath })

it('when manifest does not exist', async () => {
  expect(await get(EXTERNAL_MODULE_NAME))
    .toBe(EXTERNAL_MODULE_NAME + '/' + ENTRY_DEFAULT_MJS)
})

it('when manifest exists but does not contain entry fields', async () => {
  expect(await get(EXTERNAL_MODULE_NAME_DEFAULT))
    .toBe(EXTERNAL_MODULE_NAME_DEFAULT + '/' + ENTRY_DEFAULT_MJS)
})

it('when manifest exists and contains "module"', async () => {
  expect(await get(EXTERNAL_MODULE_NAME_MODULE))
    .toBe(EXTERNAL_MODULE_NAME_MODULE + '/' + ENTRY_MODULE)
})

it('when manifest exists and contains "browser"', async () => {
  expect(await get(EXTERNAL_MODULE_NAME_BROWSER))
    .toBe(EXTERNAL_MODULE_NAME_BROWSER + '/' + ENTRY_BROWSER)
})

it('when manifest exists and contains "main"', async () => {
  expect(await get(EXTERNAL_MODULE_NAME_MAIN))
    .toBe(EXTERNAL_MODULE_NAME_MAIN + '/' + ENTRY_MAIN_MJS)
})
