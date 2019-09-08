import { isMjsPackage } from '@make-mjs/mjs-path'

it('returns false', () => {
  expect(isMjsPackage()).toBe(false)
})
