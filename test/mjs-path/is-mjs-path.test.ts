import { isMjsPath } from '@make-mjs/mjs-path'

const get = (modulePath: string) => isMjsPath({ modulePath })

it('returns false when module path has no extension', () => {
  expect(get('module-path')).toBe(false)
})

it('returns false when module path ends with ".js"', () => {
  expect(get('module-path.js')).toBe(false)
})

it('returns true when module path ends with ".mjs"', () => {
  expect(get('module-path.mjs')).toBe(true)
})

it('returns false when module path ends other extensions', () => {
  expect(get('module-path.html')).toBe(false)
})
