import { fnOr } from '@make-mjs/utils'
import DEFAULT from './is-mjs-package'

interface Options {
  readonly packageName: string
}

interface Tester {
  (options: Options): boolean
}

export function mjsPackageTester (mjsPackages: readonly string[]): Tester {
  return options => mjsPackages.includes(options.packageName)
}

export function mjsPackageTesterDef (
  mjsPackages: readonly string[],
  def: Tester = DEFAULT
): Tester {
  return fnOr(mjsPackageTester(mjsPackages), def)
}

export function nonMjsPackageTester (nonMjsPackages: readonly string[]): Tester {
  return options => !nonMjsPackages.includes(options.packageName)
}

export function nonMjsPackageTesterDef (
  nonMjsPackages: readonly string[],
  def: Tester = DEFAULT
): Tester {
  const isMjsPackage = mjsPackageTesterDef(nonMjsPackages, def)
  return options => !isMjsPackage(options)
}
