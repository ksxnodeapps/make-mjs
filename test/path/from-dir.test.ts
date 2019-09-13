import { fromDir } from '@make-mjs/path'

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
  EXTERNAL_MODULE_NAME_MAIN,
  EXTERNAL_MODULE_NAME_NONMJS
} from './fsx-mocks'

const getPresentMjs = (modulePath: string) =>
  fromDir({ moduleContainer: MODULE_CONTAINER, forceMjs: false, modulePath })

const getAbsentMjs = (modulePath: string) =>
  fromDir({ moduleContainer: MODULE_CONTAINER, forceMjs: true, modulePath })

const getNonMjs = (modulePath: string) =>
  fromDir({ moduleContainer: MODULE_CONTAINER, forceMjs: false, modulePath })

it('when manifest does not exist', async () => {
  expect(await getPresentMjs(EXTERNAL_MODULE_NAME))
    .toBe(EXTERNAL_MODULE_NAME + '/' + ENTRY_DEFAULT_MJS)
})

it('when manifest exists but does not contain entry fields', async () => {
  expect(await getPresentMjs(EXTERNAL_MODULE_NAME_DEFAULT))
    .toBe(EXTERNAL_MODULE_NAME_DEFAULT + '/' + ENTRY_DEFAULT_MJS)
})

it('when manifest exists and contains "module"', async () => {
  expect(await getPresentMjs(EXTERNAL_MODULE_NAME_MODULE))
    .toBe(EXTERNAL_MODULE_NAME_MODULE + '/' + ENTRY_MODULE)
})

it('when manifest exists and contains "browser"', async () => {
  expect(await getPresentMjs(EXTERNAL_MODULE_NAME_BROWSER))
    .toBe(EXTERNAL_MODULE_NAME_BROWSER + '/' + ENTRY_BROWSER)
})

it('when manifest exists and contains "main"', async () => {
  expect(await getPresentMjs(EXTERNAL_MODULE_NAME_MAIN))
    .toBe(EXTERNAL_MODULE_NAME_MAIN + '/' + ENTRY_MAIN_MJS)
})

it('when mjs file does not exist and forceMjs is true', async () => {
  expect(await getAbsentMjs(EXTERNAL_MODULE_NAME_NONMJS))
    .toBe(EXTERNAL_MODULE_NAME_NONMJS + '/' + ENTRY_MAIN_MJS)
})

it('when mjs file does not exist and forceMjs is false', async () => {
  expect(await getNonMjs(EXTERNAL_MODULE_NAME_NONMJS))
    .toBe(EXTERNAL_MODULE_NAME_NONMJS)
})
