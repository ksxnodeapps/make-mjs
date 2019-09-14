import * as fsTreeUtils from 'fs-tree-utils'
import { MaybePromise } from '@make-mjs/utils'
import { CodeTransformOptions } from '@make-mjs/file'
import TraversalOptions = fsTreeUtils.Traverse.Options
import TraversalDeepFunc = TraversalOptions.DeepFunc
import TraversalStatFunc = TraversalOptions.StatFunc

export {
  TraversalOptions,
  TraversalDeepFunc,
  TraversalStatFunc
}

export interface FilterFunc {
  (param: FilterFunc.Param): boolean
}

export namespace FilterFunc {
  export interface Param extends TraversalDeepFunc.Param {}
}

interface ReadSharedOptions {
  readonly filter?: FilterFunc
  readonly deep?: TraversalDeepFunc
  readonly stat?: TraversalStatFunc
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
  readonly files: InputFileList
}

export interface MainOptions extends ReadOptions, TransformSharedOptions {}

export interface File {
  path: string
  content: string
}

export type InputFileList = MaybePromise<readonly MaybePromise<File>[]>
export type OutputFileList = Promise<Promise<File>[]>
