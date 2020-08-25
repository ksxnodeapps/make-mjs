import { ParserOptions, parseCode } from './parse-code'
import { GeneratorOptions, generateCode } from './generate-code'

export interface ReformatOptions {
  readonly parserOptions?: ParserOptions
  readonly generatorOptions?: GeneratorOptions
}

export function formatCode(code: string, options: ReformatOptions = {}): string {
  const { parserOptions, generatorOptions } = options
  const ast = parseCode(code, parserOptions)
  return generateCode(ast as any, generatorOptions).code
}

export default formatCode
