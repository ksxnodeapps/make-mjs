import { addProperty } from '@make-mjs/utils'

const value = Symbol('value')

describe('with null as proto', () => {
  const proto = null

  describe('with a string as key', () => {
    const key = 'abc'
    const get = () => addProperty(proto, key, value)

    it('returns an object that has null as prototype', () => {
      expect(Object.getPrototypeOf(get())).toBe(null)
    })

    it('returns an object that has [key] set to value', () => {
      expect(get()).toHaveProperty(key, value)
    })
  })

  describe('with a number as key', () => {
    const key = 123
    const get = () => addProperty(proto, key, value)

    it('returns an object that has null as prototype', () => {
      expect(Object.getPrototypeOf(get())).toBe(null)
    })

    it('returns an object that has [key] set to value', () => {
      expect(get()).toHaveProperty(String(key), value)
    })
  })

  describe('with a symbol as key', () => {
    const key = Symbol('key')
    const get = () => addProperty(proto, key, value)

    it('returns an object that has null as prototype', () => {
      expect(Object.getPrototypeOf(get())).toBe(null)
    })

    it('returns an object that has [key] set to value', () => {
      expect(get()[key]).toBe(value)
    })
  })
})

describe('with an object as proto', () => {
  const proto = null

  describe('with a string as key', () => {
    const key = 'abc'
    const get = () => addProperty(proto, key, value)

    it('returns an object that has proto as prototype', () => {
      expect(Object.getPrototypeOf(get())).toBe(proto)
    })

    it('returns an object that has [key] set to value', () => {
      expect(get()).toHaveProperty(key, value)
    })

    it('returns an object that is not proto', () => {
      expect(get()).not.toBe(proto)
    })
  })

  describe('with a number as key', () => {
    const key = 123
    const get = () => addProperty(proto, key, value)

    it('returns an object that has proto as prototype', () => {
      expect(Object.getPrototypeOf(get())).toBe(proto)
    })

    it('returns an object that has [key] set to value', () => {
      expect(get()).toHaveProperty(String(key), value)
    })

    it('returns an object that is not proto', () => {
      expect(get()).not.toBe(proto)
    })
  })

  describe('with a symbol as key', () => {
    const key = Symbol('key')
    const get = () => addProperty(proto, key, value)

    it('returns an object that has proto as prototype', () => {
      expect(Object.getPrototypeOf(get())).toBe(proto)
    })

    it('returns an object that has [key] set to value', () => {
      expect(get()[key]).toBe(value)
    })

    it('returns an object that is not proto', () => {
      expect(get()).not.toBe(proto)
    })
  })
})
