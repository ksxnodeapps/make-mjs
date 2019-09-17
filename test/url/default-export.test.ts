import main, { getMjsUrl } from '@make-mjs/url'

it('exports getMjsUrl as default', () => {
  expect(main).toBe(getMjsUrl)
})
