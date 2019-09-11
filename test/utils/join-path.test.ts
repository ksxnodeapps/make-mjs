import { joinPath } from '@make-mjs/utils'

it('works', () => {
  expect(joinPath('abc', 'def/', 'ghi', '', 'jkl')).toBe('abc/def/ghi/jkl')
})
