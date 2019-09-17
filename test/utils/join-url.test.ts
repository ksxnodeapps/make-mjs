import { joinUrl } from '@make-mjs/utils'

it('works', () => {
  expect(joinUrl('abc', 'def/', 'ghi', '', 'jkl')).toBe('abc/def/ghi/jkl')
})
