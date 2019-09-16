export enum ModulePathKind {
  Internal = 'Internal',
  External = 'External'
}

export interface ModulePathParsingResultBase {
  readonly kind: ModulePathKind
  readonly name: string | null
  readonly path: string
}

export interface InternalModulePathParsingResult extends ModulePathParsingResultBase {
  readonly kind: ModulePathKind.Internal
  readonly name: null
}

export interface ExternalModulePathParsingResult extends ModulePathParsingResultBase {
  readonly kind: ModulePathKind.External
  readonly name: string
}

export type ModulePathParsingResult =
  InternalModulePathParsingResult |
  ExternalModulePathParsingResult
