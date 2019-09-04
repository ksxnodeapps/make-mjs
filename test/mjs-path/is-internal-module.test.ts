import { isInternalModule } from '@make-mjs/mjs-path'

const get = (modulePath: string) => isInternalModule({ modulePath })

describe('returns false', () => {
  it('when it does not begins with a leading dot', () => {
    expect(get('module-name')).toBe(false)
  })

  it('when it begins with a leading dot but followed by a letter', () => {
    expect(get('.module-name')).toBe(false)
  })
})

describe('returns true', () => {
  it('when it begins with a leading "./"', () => {
    expect(get('./module-name')).toBe(true)
  })

  it('when it begins with a leading "../"', () => {
    expect(get('../module-name')).toBe(true)
  })
})
