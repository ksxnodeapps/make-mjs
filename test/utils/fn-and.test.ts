import { fnAnd } from '@make-mjs/utils'

describe('table', () => {
  it('F * F = F', () => {
    expect(
      fnAnd(() => false, () => false)(null)
    ).toBe(false)
  })

  it('F * T = F', () => {
    expect(
      fnAnd(() => false, () => true)(null)
    ).toBe(false)
  })

  it('T * F = F', () => {
    expect(
      fnAnd(() => true, () => false)(null)
    ).toBe(false)
  })

  it('T * T = T', () => {
    expect(
      fnAnd(() => true, () => true)(null)
    ).toBe(true)
  })
})

describe('when first function returns falsy value', () => {
  function setup () {
    const arg = Symbol('x')
    const firstFunc = jest.fn(() => null)
    const secondFunc = jest.fn(() => 'second' as const)
    const resultFunc = fnAnd(firstFunc, secondFunc)
    return { arg, firstFunc, secondFunc, resultFunc }
  }

  describe('when resulting function is not called', () => {
    it('does not call first function', () => {
      const { firstFunc } = setup()
      expect(firstFunc).not.toBeCalled()
    })

    it('does not call second function', () => {
      const { secondFunc } = setup()
      expect(secondFunc).not.toBeCalled()
    })
  })

  describe('when resulting function is called once', () => {
    function call () {
      const { arg, resultFunc, ...rest } = setup()
      const resultVal = resultFunc(arg)
      return { ...rest, arg, resultFunc, resultVal }
    }

    it('calls first function once', () => {
      const { firstFunc } = call()
      expect(firstFunc).toBeCalledTimes(1)
    })

    it('calls first function with expected argument', () => {
      const { arg, firstFunc } = call()
      expect(firstFunc).toBeCalledWith(arg)
    })

    it('does not call second function', () => {
      const { secondFunc } = call()
      expect(secondFunc).not.toBeCalled()
    })

    it('returns result of the first function', () => {
      const { firstFunc, resultVal } = call()
      expect(resultVal).toBe(firstFunc())
    })
  })

  describe('when resulting function is called multiple times', () => {
    function call () {
      const { arg, resultFunc, ...rest } = setup()
      const times = 5
      const resultVals = Array(times).fill(arg).map(resultFunc)
      return { ...rest, arg, resultFunc, times, resultVals }
    }

    it('calls first function for every time resulting function is called', () => {
      const { firstFunc, times } = call()
      expect(firstFunc).toBeCalledTimes(times)
    })

    it('calls first function with expected argument', () => {
      const { arg, firstFunc } = call()
      expect(firstFunc).toBeCalledWith(arg)
    })

    it('does not call second function', () => {
      const { secondFunc } = call()
      expect(secondFunc).not.toBeCalled()
    })

    it('returns result of the first function', () => {
      const { firstFunc, times, resultVals } = call()
      expect(resultVals).toEqual(Array(times).fill(firstFunc()))
    })
  })
})

describe('when first function returns truthy value', () => {
  function setup () {
    const arg = Symbol('x')
    const firstFunc = jest.fn(() => 'first' as const)
    const secondFunc = jest.fn(() => 'second' as const)
    const resultFunc = fnAnd(firstFunc, secondFunc)
    return { arg, firstFunc, secondFunc, resultFunc }
  }

  describe('when resulting function is not called', () => {
    it('does not call first function', () => {
      const { firstFunc } = setup()
      expect(firstFunc).not.toBeCalled()
    })

    it('does not call second function', () => {
      const { secondFunc } = setup()
      expect(secondFunc).not.toBeCalled()
    })
  })

  describe('when resulting function is called once', () => {
    function call () {
      const { arg, resultFunc, ...rest } = setup()
      const resultVal = resultFunc(arg)
      return { ...rest, arg, resultFunc, resultVal }
    }

    it('calls first function once', () => {
      const { firstFunc } = call()
      expect(firstFunc).toBeCalledTimes(1)
    })

    it('calls first function with expected argument', () => {
      const { arg, firstFunc } = call()
      expect(firstFunc).toBeCalledWith(arg)
    })

    it('calls second function once', () => {
      const { secondFunc } = call()
      expect(secondFunc).toBeCalledTimes(1)
    })

    it('calls second function with expected argument', () => {
      const { arg, secondFunc } = call()
      expect(secondFunc).toBeCalledWith(arg)
    })

    it('calls second function with expected argument', () => {
      const { arg, secondFunc } = call()
      expect(secondFunc).toBeCalledWith(arg)
    })

    it('returns result of the second function', () => {
      const { secondFunc, resultVal } = call()
      expect(resultVal).toBe(secondFunc())
    })
  })

  describe('when resulting function is called multiple times', () => {
    function call () {
      const { arg, resultFunc, ...rest } = setup()
      const times = 5
      const resultVals = Array(times).fill(arg).map(resultFunc)
      return { ...rest, arg, resultFunc, times, resultVals }
    }

    it('calls first function for every time resulting function is called', () => {
      const { firstFunc, times } = call()
      expect(firstFunc).toBeCalledTimes(times)
    })

    it('calls first function with expected argument', () => {
      const { arg, firstFunc } = call()
      expect(firstFunc).toBeCalledWith(arg)
    })

    it('calls second function for every time resulting function is called', () => {
      const { secondFunc, times } = call()
      expect(secondFunc).toBeCalledTimes(times)
    })

    it('calls second function with expected argument', () => {
      const { arg, secondFunc } = call()
      expect(secondFunc).toBeCalledWith(arg)
    })

    it('returns result of the second function', () => {
      const { secondFunc, times, resultVals } = call()
      expect(resultVals).toEqual(Array(times).fill(secondFunc()))
    })
  })
})
