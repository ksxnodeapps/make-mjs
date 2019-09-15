import DEFAULT, { main } from '@make-mjs/main'

it('export main as default', () => {
  expect(DEFAULT).toBe(main)
})
