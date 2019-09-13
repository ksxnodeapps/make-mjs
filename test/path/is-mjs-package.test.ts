import { isMjsPackage } from '@make-mjs/path'

it('returns false', () => {
  expect(isMjsPackage()).toBe(false)
})
