import { isMjsPackage } from '@make-mjs/url'

it('returns false', () => {
  expect(isMjsPackage()).toBe(false)
})
