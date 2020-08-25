import { ParserOptions } from '@babel/parser'

export const DEFAULT_PARSER_OPTIONS: ParserOptions = {
  sourceType: 'unambiguous',
  plugins: ['dynamicImport', 'importMeta'],
}

export default DEFAULT_PARSER_OPTIONS
