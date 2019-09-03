import { isMjsPath } from '@make-mjs/mjs-path'

it('returns false when module path has no extension', () => {
  expect(isMjsPath('module-path')).toBe(false)
})

it('returns false when module path ends with ".js"', () => {
  expect(isMjsPath('module-path.js')).toBe(false)
})

it('returns true when module path ends with ".mjs"', () => {
  expect(isMjsPath('module-path.mjs')).toBe(true)
})

it('returns false when module path ends other extensions', () => {
  expect(isMjsPath('module-path.html')).toBe(false)
})
