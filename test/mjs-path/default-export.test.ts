import main, { getMjsPath } from '@make-mjs/mjs-path'

it('exports getMjsPath as default', () => {
  expect(main).toBe(getMjsPath)
})
