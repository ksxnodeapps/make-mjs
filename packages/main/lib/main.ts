import { addProperty } from '@tsfun/object'
import { MainOptions } from './types'
import read from './read'
import transform from './transform'
import write from './write'

export async function * main (options: MainOptions) {
  const input = read(options)
  const transformOptions = addProperty(options, 'files', input)
  const output = transform(transformOptions)
  yield * write(output)
}

export default main
