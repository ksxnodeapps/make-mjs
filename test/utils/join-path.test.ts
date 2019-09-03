import { joinPath } from '@make-mjs/utils'

it('works', () => {
  expect(joinPath('abc', 'def/', 'ghi')).toBe('abc/def/ghi')
})
