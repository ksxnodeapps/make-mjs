import { formatCode } from '@make-mjs/code'

it('simple use case', () => {
  const code = `
    import a from 'a'
    import b from 'b'
    import c from 'c'
    console.log(a)
    if (b) c()
    import('d').then(console.log)
  `

  expect(formatCode(code)).toMatchSnapshot()
})
