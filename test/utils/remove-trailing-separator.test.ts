import { removeTrailingSeparator } from '@make-mjs/utils'

it('without trailing separator', () => {
  expect(removeTrailingSeparator('abc/def/ghi')).toBe('abc/def/ghi')
})

it('with trailing separator', () => {
  expect(removeTrailingSeparator('abc/def/ghi/')).toBe('abc/def/ghi')
})

it('does not remove leading separator', () => {
  expect(removeTrailingSeparator('/abc/def')).toBe('/abc/def')
})
