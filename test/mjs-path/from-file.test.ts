import { fromFile } from '@make-mjs/mjs-path'

const get = (modulePath: string) => fromFile({ modulePath })

it('without extension', () => {
  expect(get('./foo/bar')).toBe('./foo/bar.mjs')
})

it('with ".js" extension', () => {
  expect(get('./foo/bar.js')).toBe('./foo/bar.mjs')
})

it('with other extension', () => {
  expect(get('./foo/bar.css')).toBe('./foo/bar.css')
})
