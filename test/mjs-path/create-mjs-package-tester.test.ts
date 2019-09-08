import {
  mjsPackageTester,
  mjsPackageTesterDef,
  nonMjsPackageTester,
  nonMjsPackageTesterDef
} from '@make-mjs/mjs-path'

describe('mjsPackageTester', () => {
  describe('when package is in the list', () => {
    function setup () {
      const mjsPackages = ['abc', 'def', 'ghi']
      const spy = jest.spyOn(mjsPackages as any, 'includes')
      const packageName = 'def'
      const tester = mjsPackageTester(mjsPackages)
      const result = tester({ packageName })
      return { mjsPackages, spy, packageName, tester, result }
    }

    it('calls mjsPackages.includes once', () => {
      const { spy } = setup()
      expect(spy).toBeCalledTimes(1)
    })

    it('calls mjsPackages.includes with package name', () => {
      const { spy, packageName } = setup()
      expect(spy).toBeCalledWith(packageName)
    })

    it('returns true', () => {
      const { result } = setup()
      expect(result).toBe(true)
    })
  })

  describe('when package is not in the list', () => {
    function setup () {
      const mjsPackages = ['abc', 'def', 'ghi']
      const spy = jest.spyOn(mjsPackages as any, 'includes')
      const packageName = 'outside'
      const tester = mjsPackageTester(mjsPackages)
      const result = tester({ packageName })
      return { mjsPackages, spy, packageName, tester, result }
    }

    it('calls mjsPackages.includes once', () => {
      const { spy } = setup()
      expect(spy).toBeCalledTimes(1)
    })

    it('calls mjsPackages.includes with package name', () => {
      const { spy, packageName } = setup()
      expect(spy).toBeCalledWith(packageName)
    })

    it('returns false', () => {
      const { result } = setup()
      expect(result).toBe(false)
    })
  })
})

describe('mjsPackageTesterDef', () => {
  describe('without default function', () => {
    describe('when package is in the list', () => {
      function setup () {
        const mjsPackages = ['abc', 'def', 'ghi']
        const spy = jest.spyOn(mjsPackages as any, 'includes')
        const packageName = 'def'
        const tester = mjsPackageTesterDef(mjsPackages)
        const result = tester({ packageName })
        return { mjsPackages, spy, packageName, tester, result }
      }

      it('calls mjsPackages.includes once', () => {
        const { spy } = setup()
        expect(spy).toBeCalledTimes(1)
      })

      it('calls mjsPackages.includes with package name', () => {
        const { spy, packageName } = setup()
        expect(spy).toBeCalledWith(packageName)
      })

      it('returns true', () => {
        const { result } = setup()
        expect(result).toBe(true)
      })
    })

    describe('when package is not in the list', () => {
      function setup () {
        const mjsPackages = ['abc', 'def', 'ghi']
        const spy = jest.spyOn(mjsPackages as any, 'includes')
        const packageName = 'outside'
        const tester = mjsPackageTesterDef(mjsPackages)
        const result = tester({ packageName })
        return { mjsPackages, spy, packageName, tester, result }
      }

      it('calls mjsPackages.includes once', () => {
        const { spy } = setup()
        expect(spy).toBeCalledTimes(1)
      })

      it('calls mjsPackages.includes with package name', () => {
        const { spy, packageName } = setup()
        expect(spy).toBeCalledWith(packageName)
      })

      it('returns false', () => {
        const { result } = setup()
        expect(result).toBe(false)
      })
    })
  })

  describe('with default function', () => {
    describe('when package is in the list', () => {
      function setup () {
        const mjsPackages = ['abc', 'def', 'ghi']
        const spy = jest.spyOn(mjsPackages as any, 'includes')
        const packageName = 'def'
        const defVal = Symbol('default')
        const defFunc = jest.fn(() => defVal as any)
        const tester = mjsPackageTesterDef(mjsPackages, defFunc)
        const result = tester({ packageName })
        return { mjsPackages, spy, packageName, defVal, defFunc, tester, result }
      }

      it('calls mjsPackages.includes once', () => {
        const { spy } = setup()
        expect(spy).toBeCalledTimes(1)
      })

      it('calls mjsPackages.includes with package name', () => {
        const { spy, packageName } = setup()
        expect(spy).toBeCalledWith(packageName)
      })

      it('does not call default function', () => {
        const { defFunc } = setup()
        expect(defFunc).not.toBeCalled()
      })

      it('returns true', () => {
        const { result } = setup()
        expect(result).toBe(true)
      })
    })

    describe('when package is not in the list', () => {
      function setup () {
        const mjsPackages = ['abc', 'def', 'ghi']
        const spy = jest.spyOn(mjsPackages as any, 'includes')
        const packageName = 'outside'
        const options = { packageName }
        const defVal = Symbol('default')
        const defFunc = jest.fn(() => defVal as any)
        const tester = mjsPackageTesterDef(mjsPackages, defFunc)
        const result = tester(options)
        return { mjsPackages, spy, packageName, options, defVal, defFunc, tester, result }
      }

      it('calls mjsPackages.includes once', () => {
        const { spy } = setup()
        expect(spy).toBeCalledTimes(1)
      })

      it('calls mjsPackages.includes with package name', () => {
        const { spy, packageName } = setup()
        expect(spy).toBeCalledWith(packageName)
      })

      it('calls default function once', () => {
        const { defFunc } = setup()
        expect(defFunc).toBeCalledTimes(1)
      })

      it('calls default function with', () => {
        const { options, defFunc } = setup()
        expect(defFunc).toBeCalledWith(options)
      })

      it('returns result of default function', () => {
        const { result, defVal } = setup()
        expect(result).toBe(defVal)
      })
    })
  })
})

describe('nonMjsPackageTester', () => {
  describe('when package is not in the list', () => {
    function setup () {
      const mjsPackages = ['abc', 'def', 'ghi']
      const spy = jest.spyOn(mjsPackages as any, 'includes')
      const packageName = 'def'
      const tester = nonMjsPackageTester(mjsPackages)
      const result = tester({ packageName })
      return { mjsPackages, spy, packageName, tester, result }
    }

    it('calls mjsPackages.includes once', () => {
      const { spy } = setup()
      expect(spy).toBeCalledTimes(1)
    })

    it('calls mjsPackages.includes with package name', () => {
      const { spy, packageName } = setup()
      expect(spy).toBeCalledWith(packageName)
    })

    it('returns false', () => {
      const { result } = setup()
      expect(result).toBe(false)
    })
  })

  describe('when package is in the list', () => {
    function setup () {
      const mjsPackages = ['abc', 'def', 'ghi']
      const spy = jest.spyOn(mjsPackages as any, 'includes')
      const packageName = 'outside'
      const tester = mjsPackageTester(mjsPackages)
      const result = tester({ packageName })
      return { mjsPackages, spy, packageName, tester, result }
    }

    it('calls mjsPackages.includes once', () => {
      const { spy } = setup()
      expect(spy).toBeCalledTimes(1)
    })

    it('calls mjsPackages.includes with package name', () => {
      const { spy, packageName } = setup()
      expect(spy).toBeCalledWith(packageName)
    })

    it('returns false', () => {
      const { result } = setup()
      expect(result).toBe(false)
    })
  })
})

describe('nonMjsPackageTesterDef', () => {
  describe('without default function', () => {
    describe('when package is not in the list', () => {
      function setup () {
        const mjsPackages = ['abc', 'def', 'ghi']
        const spy = jest.spyOn(mjsPackages as any, 'includes')
        const packageName = 'outside'
        const tester = nonMjsPackageTesterDef(mjsPackages)
        const result = tester({ packageName })
        return { mjsPackages, spy, packageName, tester, result }
      }

      it('calls mjsPackages.includes once', () => {
        const { spy } = setup()
        expect(spy).toBeCalledTimes(1)
      })

      it('calls mjsPackages.includes with package name', () => {
        const { spy, packageName } = setup()
        expect(spy).toBeCalledWith(packageName)
      })

      it('returns true', () => {
        const { result } = setup()
        expect(result).toBe(true)
      })
    })

    describe('when package is in the list', () => {
      function setup () {
        const mjsPackages = ['abc', 'def', 'ghi']
        const spy = jest.spyOn(mjsPackages as any, 'includes')
        const packageName = 'outside'
        const tester = mjsPackageTesterDef(mjsPackages)
        const result = tester({ packageName })
        return { mjsPackages, spy, packageName, tester, result }
      }

      it('calls mjsPackages.includes once', () => {
        const { spy } = setup()
        expect(spy).toBeCalledTimes(1)
      })

      it('calls mjsPackages.includes with package name', () => {
        const { spy, packageName } = setup()
        expect(spy).toBeCalledWith(packageName)
      })

      it('returns false', () => {
        const { result } = setup()
        expect(result).toBe(false)
      })
    })
  })

  describe('with default function', () => {
    describe('when package is not in the list', () => {
      function setup () {
        const mjsPackages = ['abc', 'def', 'ghi']
        const spy = jest.spyOn(mjsPackages as any, 'includes')
        const packageName = 'outside'
        const options = { packageName }
        const defVal = Symbol('default')
        const defFunc = jest.fn(() => defVal as any)
        const tester = mjsPackageTesterDef(mjsPackages, defFunc)
        const result = tester(options)
        return { mjsPackages, spy, packageName, options, defVal, defFunc, tester, result }
      }

      it('calls mjsPackages.includes once', () => {
        const { spy } = setup()
        expect(spy).toBeCalledTimes(1)
      })

      it('calls mjsPackages.includes with package name', () => {
        const { spy, packageName } = setup()
        expect(spy).toBeCalledWith(packageName)
      })

      it('calls default function once', () => {
        const { defFunc } = setup()
        expect(defFunc).toBeCalledTimes(1)
      })

      it('calls default function with', () => {
        const { options, defFunc } = setup()
        expect(defFunc).toBeCalledWith(options)
      })

      it('returns true', () => {
        const { defVal, result } = setup()
        expect(result).toBe(defVal)
      })
    })

    describe('when package is in the list', () => {
      function setup () {
        const mjsPackages = ['abc', 'def', 'ghi']
        const spy = jest.spyOn(mjsPackages as any, 'includes')
        const packageName = 'def'
        const options = { packageName }
        const defFunc = jest.fn(() => false)
        const tester = mjsPackageTesterDef(mjsPackages, defFunc)
        const result = tester(options)
        return { mjsPackages, spy, packageName, options, defFunc, tester, result }
      }

      it('calls mjsPackages.includes once', () => {
        const { spy } = setup()
        expect(spy).toBeCalledTimes(1)
      })

      it('calls mjsPackages.includes with package name', () => {
        const { spy, packageName } = setup()
        expect(spy).toBeCalledWith(packageName)
      })

      it('does not call default function', () => {
        const { defFunc } = setup()
        expect(defFunc).not.toBeCalled()
      })

      it('returns true', () => {
        const { result } = setup()
        expect(result).toBe(true)
      })
    })
  })
})
