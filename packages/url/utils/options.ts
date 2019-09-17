import { MaybePromise } from '@make-mjs/utils'

export type FullMjsPathOptions = Required<MjsPathOptions>
export type FullModulePathResolverOptions = Required<ModulePathResolverOptions>

export interface ModuleUrlResolver {
  (options: ModulePathResolverOptions): MaybePromise<string>
}

export interface ModulePathResolverOptions extends MjsPathOptions {
  readonly modulePath: string
  readonly moduleContainer: readonly string[]
  readonly isMjsPackage: MjsPackageTester
  readonly forceMjs: boolean
  readonly newExt?: string
}

export interface ModuleUrlTester {
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
  readonly moduleContainer: readonly string[]
  readonly fromFile?: ModuleUrlResolver
  readonly fromDir?: ModuleUrlResolver
  readonly isMjsUrl?: ModuleUrlTester
  readonly isInternalModule?: ModuleUrlTester
  readonly isMjsPackage?: MjsPackageTester
}
