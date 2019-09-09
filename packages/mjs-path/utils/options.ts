import { MaybePromise } from '@make-mjs/utils'
import { ModulePathParsingResult } from './module-parsing-result'

export type FullMjsPathOptions = Required<MjsPathOptions>
export type FullModulePathResolverOptions = Required<ModulePathResolverOptions>

export interface ModulePathResolver {
  (options: ModulePathResolverOptions): MaybePromise<string>
}

export interface ModulePathResolverOptions extends MjsPathOptions {
  readonly modulePath: string
  readonly moduleContainer: string
  readonly isMjsPackage: MjsPackageTester
  readonly modulePathParsingResult: ModulePathParsingResult
  readonly forceMjs: boolean
  readonly newExt?: string
}

export interface ModulePathTester {
  (options: FullMjsPathOptions): MaybePromise<boolean>
}

export interface MjsPackageTesterOptions extends MjsPathOptions {
  readonly packageName: string
}

export interface MjsPackageTester {
  (options: MjsPackageTesterOptions): MaybePromise<boolean>
}

export interface MjsPathOptions {
  readonly modulePath: string
  readonly moduleContainer: string
  readonly fromFile?: ModulePathResolver
  readonly fromDir?: ModulePathResolver
  readonly isMjsPath?: ModulePathTester
  readonly isInternalModule?: ModulePathTester
  readonly isMjsPackage?: MjsPackageTester
}
