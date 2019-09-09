import { parsePath } from '@make-mjs/utils'

describe('"abc/def/ghi/jkl.mno"', () => {
  const path = 'abc/def/ghi/jkl.mno'
  const get = () => parsePath(path)

  it('matches snapshot', () => {
    expect(get()).toMatchSnapshot()
  })

  it('has "dir" property', () => {
    expect(get()).toHaveProperty('dir', 'abc/def/ghi')
  })

  it('has "base" property', () => {
    expect(get()).toHaveProperty('base', 'jkl.mno')
  })

  it('has "name" property', () => {
    expect(get()).toHaveProperty('name', 'jkl')
  })

  it('has "ext" property', () => {
    expect(get()).toHaveProperty('ext', '.mno')
  })
})

describe('"abc/def/ghi/jkl.mno/"', () => {
  const path = 'abc/def/ghi/jkl.mno/'
  const get = () => parsePath(path)

  it('matches snapshot', () => {
    expect(get()).toMatchSnapshot()
  })

  it('has "dir" property', () => {
    expect(get()).toHaveProperty('dir', 'abc/def/ghi')
  })

  it('has "base" property', () => {
    expect(get()).toHaveProperty('base', 'jkl.mno')
  })

  it('has "name" property', () => {
    expect(get()).toHaveProperty('name', 'jkl')
  })

  it('has "ext" property', () => {
    expect(get()).toHaveProperty('ext', '.mno')
  })
})

describe('"abc/def/ghi/jkl"', () => {
  const path = 'abc/def/ghi/jkl'
  const get = () => parsePath(path)

  it('matches snapshot', () => {
    expect(get()).toMatchSnapshot()
  })

  it('has "dir" property', () => {
    expect(get()).toHaveProperty('dir', 'abc/def/ghi')
  })

  it('has "base" property', () => {
    expect(get()).toHaveProperty('base', 'jkl')
  })

  it('has "name" property', () => {
    expect(get()).toHaveProperty('name', 'jkl')
  })

  it('has "ext" property', () => {
    expect(get()).toHaveProperty('ext', '')
  })
})

describe('"abc/def/ghi/jkl."', () => {
  const path = 'abc/def/ghi/jkl.'
  const get = () => parsePath(path)

  it('matches snapshot', () => {
    expect(get()).toMatchSnapshot()
  })

  it('has "dir" property', () => {
    expect(get()).toHaveProperty('dir', 'abc/def/ghi')
  })

  it('has "base" property', () => {
    expect(get()).toHaveProperty('base', 'jkl.')
  })

  it('has "name" property', () => {
    expect(get()).toHaveProperty('name', 'jkl')
  })

  it('has "ext" property', () => {
    expect(get()).toHaveProperty('ext', '.')
  })
})

describe('"/abc.def"', () => {
  const path = '/abc.def'
  const get = () => parsePath(path)

  it('matches snapshot', () => {
    expect(get()).toMatchSnapshot()
  })

  it('has "dir" property', () => {
    expect(get()).toHaveProperty('dir', '')
  })

  it('has "base" property', () => {
    expect(get()).toHaveProperty('base', 'abc.def')
  })

  it('has "name" property', () => {
    expect(get()).toHaveProperty('name', 'abc')
  })

  it('has "ext" property', () => {
    expect(get()).toHaveProperty('ext', '.def')
  })
})

describe('"abc.def"', () => {
  const path = 'abc.def'
  const get = () => parsePath(path)

  it('matches snapshot', () => {
    expect(get()).toMatchSnapshot()
  })

  it('has "dir" property', () => {
    expect(get()).toHaveProperty('dir', '')
  })

  it('has "base" property', () => {
    expect(get()).toHaveProperty('base', 'abc.def')
  })

  it('has "name" property', () => {
    expect(get()).toHaveProperty('name', 'abc')
  })

  it('has "ext" property', () => {
    expect(get()).toHaveProperty('ext', '.def')
  })
})

describe('"/abc.def"', () => {
  const path = '/abc.def'
  const get = () => parsePath(path)

  it('matches snapshot', () => {
    expect(get()).toMatchSnapshot()
  })

  it('has "dir" property', () => {
    expect(get()).toHaveProperty('dir', '')
  })

  it('has "base" property', () => {
    expect(get()).toHaveProperty('base', 'abc.def')
  })

  it('has "name" property', () => {
    expect(get()).toHaveProperty('name', 'abc')
  })

  it('has "ext" property', () => {
    expect(get()).toHaveProperty('ext', '.def')
  })
})

describe('""', () => {
  const path = ''
  const get = () => parsePath(path)

  it('matches snapshot', () => {
    expect(get()).toMatchSnapshot()
  })

  it('has "dir" property', () => {
    expect(get()).toHaveProperty('dir', '')
  })

  it('has "base" property', () => {
    expect(get()).toHaveProperty('base', '')
  })

  it('has "name" property', () => {
    expect(get()).toHaveProperty('name', '')
  })

  it('has "ext" property', () => {
    expect(get()).toHaveProperty('ext', '')
  })
})
