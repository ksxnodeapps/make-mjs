import { REJECTION_SILENCER, silenceRejection } from '@make-mjs/utils'

describe('when input promise resolves', () => {
  function setup () {
    const value = Symbol('value')
    const input = Promise.resolve(value)
    const catchSpy = jest.spyOn(input, 'catch')
    const output = silenceRejection(input)
    return { value, input, output, catchSpy }
  }

  it('returns input promise as output', () => {
    const { input, output } = setup()
    void expect(output).toBe(input)
  })

  it('calls .catch on input promise', async () => {
    const { catchSpy } = setup()
    expect(catchSpy).toBeCalledWith(REJECTION_SILENCER)
  })
})

describe('when input promise rejects', () => {
  function setup () {
    const reason = Symbol('reason')
    const input = Promise.reject(reason)
    const catchSpy = jest.spyOn(input, 'catch')
    const output = silenceRejection(input)
    return { reason, input, output, catchSpy }
  }

  it('returns input promise as output', () => {
    const { input, output } = setup()
    void expect(output).toBe(input)
  })

  it('calls .catch on input promise', async () => {
    const { catchSpy } = setup()
    expect(catchSpy).toBeCalledWith(REJECTION_SILENCER)
  })
})
