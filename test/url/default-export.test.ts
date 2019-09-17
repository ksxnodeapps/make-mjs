import main, { getMjsPath } from '@make-mjs/url'

it('exports getMjsPath as default', () => {
  expect(main).toBe(getMjsPath)
})
