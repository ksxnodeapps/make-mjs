import { MaybePromise } from '@make-mjs/utils'
import { Stats } from '@make-mjs/fs-extra'
import { CodeTransformOptions } from '@make-mjs/code'

export interface FilterFunc {
  (param: FilterFunc.Param): boolean
}

export namespace FilterFunc {
  export interface Param extends TraverseReturn {}
}

export interface StatFunc {
  (path: string): MaybePromise<Stats>
}

export interface TraverseOptions {
  readonly deep?: FilterFunc
  readonly stat?: StatFunc
}

export interface TraverseReturn {
  base: string
  path: string
}

interface ReadSharedOptions extends TraverseOptions {
  readonly filter?: FilterFunc
}

export interface ReadOptions extends ReadSharedOptions {
  readonly dirname: string
}

export interface PathTransformFunc {
  (path: string): string
}

interface TransformSharedOptions {
  readonly getNewPath?: PathTransformFunc
  readonly codeTransformOptions?: Omit<CodeTransformOptions, 'moduleContainer'>
}

export interface TransformOptions extends TransformSharedOptions {
  readonly files: AsyncIterable<File>
}

export interface MainOptions extends ReadOptions, TransformSharedOptions {}

export interface File {
  path: string
  content: string
}
