import { convertUrlToPath } from '@make-mjs/utils'

it('"abc/def/ghi" → "abc/def/ghi"', () => {
  expect(convertUrlToPath('abc/def/ghi')).toBe('abc/def/ghi')
})

it('"./abc/def/ghi" → "abc/def/ghi"', () => {
  expect(convertUrlToPath('./abc/def/ghi')).toBe('abc/def/ghi')
})

it('"abc/def/ghi/" → "abc/def/ghi"', () => {
  expect(convertUrlToPath('abc/def/ghi/')).toBe('abc/def/ghi')
})

it('"/abc/def/ghi" → "/abc/def/ghi"', () => {
  expect(convertUrlToPath('/abc/def/ghi')).toBe('/abc/def/ghi')
})
