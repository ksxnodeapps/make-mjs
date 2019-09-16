import { parseModulePath, ModulePathKind } from '@make-mjs/path'

describe('with "./foo/bar/baz"', () => {
  const path = './foo/bar/baz'
  const get = () => parseModulePath(path)

  it('has "kind" property that is "Internal"', () => {
    expect(get()).toHaveProperty('kind', ModulePathKind.Internal)
  })

  it('has "name" property that is null', () => {
    expect(get()).toHaveProperty('name', null)
  })

  it('has "path" property that is original path', () => {
    expect(get()).toHaveProperty('path', path)
  })
})

describe('with "../foo/bar/baz"', () => {
  const path = '../foo/bar/baz'
  const get = () => parseModulePath(path)

  it('has "kind" property that is "Internal"', () => {
    expect(get()).toHaveProperty('kind', ModulePathKind.Internal)
  })

  it('has "name" property that is null', () => {
    expect(get()).toHaveProperty('name', null)
  })

  it('has "path" property that is original path', () => {
    expect(get()).toHaveProperty('path', path)
  })
})

describe('with "foo/bar/baz"', () => {
  const path = 'foo/bar/baz'
  const get = () => parseModulePath(path)

  it('has "kind" property that is "External"', () => {
    expect(get()).toHaveProperty('kind', ModulePathKind.External)
  })

  it('has "name" property that is "foo"', () => {
    expect(get()).toHaveProperty('name', 'foo')
  })

  it('has "path" property that is original path', () => {
    expect(get()).toHaveProperty('path', path)
  })
})

describe('with "@foo/bar/baz"', () => {
  const path = '@foo/bar/baz'
  const get = () => parseModulePath(path)

  it('has "kind" property that is "External"', () => {
    expect(get()).toHaveProperty('kind', ModulePathKind.External)
  })

  it('has "name" property that is "foo"', () => {
    expect(get()).toHaveProperty('name', '@foo/bar')
  })

  it('has "path" property that is original path', () => {
    expect(get()).toHaveProperty('path', path)
  })
})
