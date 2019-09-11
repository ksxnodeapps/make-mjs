import { parse } from '@babel/parser'
import { File } from './types'
import OPTIONS from './default-parser-options'
export * from '@babel/parser'
export const parseCode = (code: string, options = OPTIONS): File => parse(code, options)
export default parseCode
