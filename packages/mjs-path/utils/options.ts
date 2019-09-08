import { MaybePromise } from '@make-mjs/utils'

export type FullMjsPathOptions = Required<MjsPathOptions>

export interface ModulePathResolver {
  (options: FullMjsPathOptions): MaybePromise<string>
}

export interface ModulePathTester {
  (options: FullMjsPathOptions): MaybePromise<boolean>
}

export interface MjsPackageTesterOptions extends MjsPathOptions {
  readonly packageName: string
  readonly moduleEntry: string
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

export interface FromDirOptions extends MjsPathOptions {
  readonly modulePath: string
  readonly moduleContainer: string
  readonly isMjsPackage: MjsPackageTester
  readonly newExt?: string
}
