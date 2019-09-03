import { isInternalModule } from '@make-mjs/mjs-path'

describe('returns false', () => {
  it('when it does not begins with a leading dot', () => {
    expect(isInternalModule('module-name')).toBe(false)
  })

  it('when it begins with a leading dot but followed by a letter', () => {
    expect(isInternalModule('.module-name')).toBe(false)
  })
})

describe('returns true', () => {
  it('when it begins with a leading "./"', () => {
    expect(isInternalModule('./module-name')).toBe(true)
  })

  it('when it begins with a leading "../"', () => {
    expect(isInternalModule('../module-name')).toBe(true)
  })
})
