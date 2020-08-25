import { Linter } from 'eslint'

const linter = new Linter()

function rule<Value>(value: Value): ['error', Value] {
  return ['error', value]
}

const linterConfig: Linter.Config<Linter.RulesRecord> = {
  rules: {
    quotes: rule('single' as const),
    semi: rule('never' as const),
    indent: rule(2 as const),
    'space-before-function-paren': rule('never' as const),
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
  },
}

/**
 * Use ESLint to enforce a consistent styling
 * to enable comparing code in unit tests
 * @param code Code to format
 */
export function formatCode(code: string) {
  const report = linter.verifyAndFix(code, linterConfig)

  if (!report.fixed && report.messages.length) {
    const message = report.messages
      .map(item => `(${item.line}:${item.column}) ${item.message}`)
      .join('\n')

    throw new Error(message)
  }

  const withoutEmptyLines = report.output
    .split('\n')
    .filter(x => x.trim())
    .join('\n')

  return '\n' + withoutEmptyLines + '\n'
}
