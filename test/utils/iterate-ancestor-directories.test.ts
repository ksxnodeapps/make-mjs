import { iterateAncestorDirectories } from '@make-mjs/utils'

const get = (path: string) => Array.from(iterateAncestorDirectories(path))

it('"abc/def/ghi/jkl"', () => {
  expect(get('abc/def/ghi/jkl')).toEqual([
    'abc/def/ghi',
    'abc/def',
    'abc',
    '',
  ])
})

it('"abc/def/ghi/jkl/"', () => {
  expect(get('abc/def/ghi/jkl/')).toEqual([
    'abc/def/ghi',
    'abc/def',
    'abc',
    '',
  ])
})

it('"/abc/def/ghi/jkl"', () => {
  expect(get('/abc/def/ghi/jkl')).toEqual([
    'abc/def/ghi',
    'abc/def',
    'abc',
    '',
  ])
})

it('"/abc/def/ghi/jkl/"', () => {
  expect(get('/abc/def/ghi/jkl/')).toEqual([
    'abc/def/ghi',
    'abc/def',
    'abc',
    '',
  ])
})
