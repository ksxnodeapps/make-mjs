import { traverseImportStatements, parseCode } from '@make-mjs/mjs-file'

function setup (code: string) {
  const declaration = jest.fn()
  const expression = jest.fn()
  const options = { declaration, expression }
  const ast = parseCode(code)
  traverseImportStatements(ast, options)
  return { declaration, expression, options, ast }
}

describe('when code has no import statements', () => {
  const code = `
    // no import statements here
    console.log(123, 456)
  `

  it('does not calls options.declaration', () => {
    const { declaration } = setup(code)
    expect(declaration).not.toBeCalled()
  })

  it('does not calls options.expression', () => {
    const { expression } = setup(code)
    expect(expression).not.toBeCalled()
  })
})

describe('when code contains a static import declaration', () => {
  const code = `
    import object from 'url'
    console.log({ object })
  `

  it('calls options.declaration once', () => {
    const { declaration } = setup(code)
    expect(declaration).toBeCalledTimes(1)
  })

  it('calls options.declaration with a path to a static import declaration', () => {
    const { declaration } = setup(code)
    expect(declaration).toBeCalledWith(expect.objectContaining({
      node: expect.objectContaining({
        type: 'ImportDeclaration'
      })
    }))
  })

  it('does not calls options.expression', () => {
    const { expression } = setup(code)
    expect(expression).not.toBeCalled()
  })
})

describe('when code contains a star re-export', () => {
  const code = `
    export * from 'url'
  `

  it('calls options.declaration once', () => {
    const { declaration } = setup(code)
    expect(declaration).toBeCalledTimes(1)
  })

  it('calls options.declaration with a path to a star re-export', () => {
    const { declaration } = setup(code)
    expect(declaration).toBeCalledWith(expect.objectContaining({
      node: expect.objectContaining({
        type: 'ExportAllDeclaration'
      })
    }))
  })

  it('does not calls options.expression', () => {
    const { expression } = setup(code)
    expect(expression).not.toBeCalled()
  })
})

describe('when code contains a named re-export', () => {
  const code = `
    export { a, b, c } from 'url'
  `

  it('calls options.declaration once', () => {
    const { declaration } = setup(code)
    expect(declaration).toBeCalledTimes(1)
  })

  it('calls options.declaration with a path to a named re-export', () => {
    const { declaration } = setup(code)
    expect(declaration).toBeCalledWith(expect.objectContaining({
      node: expect.objectContaining({
        type: 'ExportNamedDeclaration'
      })
    }))
  })

  it('does not calls options.expression', () => {
    const { expression } = setup(code)
    expect(expression).not.toBeCalled()
  })
})

describe('when code contains a dynamic import expression', () => {
  const code = `
    const object = import('url')
    console.log({ object })
  `

  it('does not call options.declaration', () => {
    const { declaration } = setup(code)
    expect(declaration).not.toBeCalled()
  })

  it('calls options.expression once', () => {
    const { expression } = setup(code)
    expect(expression).toBeCalledTimes(1)
  })

  it('calls options.expression with a path to a dynamic import call expression', () => {
    const { expression } = setup(code)
    expect(expression).toBeCalledWith(expect.objectContaining({
      node: expect.objectContaining({
        type: 'CallExpression',
        callee: expect.objectContaining({
          type: 'Import'
        })
      })
    }))
  })
})

describe('when code contains a static import declaration and a dynamic import call expression', () => {
  const code = `
    import foo from './foo'

    export async function main () {
      const bar = await import('./bar')
      console.log({ foo, bar })
    }
  `

  it('calls options.declaration once', () => {
    const { declaration } = setup(code)
    expect(declaration).toBeCalledTimes(1)
  })

  it('calls options.declaration with a path to a static import declaration', () => {
    const { declaration } = setup(code)
    expect(declaration).toBeCalledWith(expect.objectContaining({
      node: expect.objectContaining({
        type: 'ImportDeclaration'
      })
    }))
  })

  it('calls options.expression once', () => {
    const { expression } = setup(code)
    expect(expression).toBeCalledTimes(1)
  })

  it('calls options.expression with a path to a dynamic import call expression', () => {
    const { expression } = setup(code)
    expect(expression).toBeCalledWith(expect.objectContaining({
      node: expect.objectContaining({
        type: 'CallExpression',
        callee: expect.objectContaining({
          type: 'Import'
        })
      })
    }))
  })
})

describe('when code contains multiple import statements', () => {
  const code = `
    import a from './a'
    import b from './b'

    export async function main () {
      const c = await import('./c')
      const d = await import('./d')
      const e = await import('./e')
      console.log({ a, b, c, d, e })
    }
  `

  it('calls options.declaration multiple times', () => {
    const { declaration } = setup(code)
    expect(declaration).toBeCalledTimes(2)
  })

  it('calls options.expression multiple times', () => {
    const { expression } = setup(code)
    expect(expression).toBeCalledTimes(3)
  })
})
