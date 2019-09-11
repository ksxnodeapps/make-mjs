import { fromFileWithoutChecking, fromFile } from '@make-mjs/mjs-path'

import {
  appendFile,
  fillAllMockedArrays
} from './fsx-mocks'

describe.skip('fromFileWithoutChecking', () => {
  const get = (modulePath: string) => fromFileWithoutChecking({ modulePath })

  it('without extension', () => {
    expect(get('./foo/bar')).toBe('./foo/bar.mjs')
  })

  it('with ".js" extension', () => {
    expect(get('./foo/bar.js')).toBe('./foo/bar.mjs')
  })

  it('with other extension', () => {
    expect(get('./foo/bar.css')).toBe('./foo/bar.css')
  })
})

describe('fromFile', () => {
  afterEach(fillAllMockedArrays)

  describe('when forceMjs is false and .mjs files exist', () => {
    const get = (modulePath: string) =>
      fromFile({ modulePath, forceMjs: false, moduleContainer: '' })

    it('without extension', async () => {
      appendFile(['./foo/bar.mjs'])
      expect(await get('./foo/bar')).toBe('./foo/bar.mjs')
    })

    it('with ".js" extension', async () => {
      appendFile(['./foo/bar.mjs'])
      expect(await get('./foo/bar.js')).toBe('./foo/bar.mjs')
    })

    it('with other extension', async () => {
      expect(await get('./foo/bar.css')).toBe('./foo/bar.css')
    })
  })

  describe('when forceMjs is false and .mjs files do not exist', () => {
    const get = (modulePath: string) =>
      fromFile({ modulePath, forceMjs: false, moduleContainer: '' })

    it('without extension', async () => {
      appendFile(['./foo/bar.mjs'])
      expect(await get('./foo/bar')).toBe('./foo/bar.mjs')
    })

    it('with ".js" extension', async () => {
      appendFile(['./foo/bar.mjs'])
      expect(await get('./foo/bar.js')).toBe('./foo/bar.mjs')
    })

    it('with other extension', async () => {
      expect(await get('./foo/bar.css')).toBe('./foo/bar.css')
    })
  })

  describe('when forceMjs is true', () => {
    const get = (modulePath: string) =>
      fromFile({ modulePath, forceMjs: true, moduleContainer: '' })

    it('without extension', async () => {
      expect(await get('./foo/bar')).toBe('./foo/bar.mjs')
    })

    it('with ".js" extension', async () => {
      expect(await get('./foo/bar.js')).toBe('./foo/bar.mjs')
    })

    it('with other extension', async () => {
      expect(await get('./foo/bar.css')).toBe('./foo/bar.css')
    })
  })
})
