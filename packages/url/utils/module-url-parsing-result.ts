export enum ModuleUrlKind {
  Internal = 'Internal',
  External = 'External'
}

export interface ModulePathParsingResultBase {
  readonly kind: ModuleUrlKind
  readonly name: string | null
  readonly path: string
}

export interface InternalModuleUrlParsingResult extends ModulePathParsingResultBase {
  readonly kind: ModuleUrlKind.Internal
  readonly name: null
}

export interface ExternalModuleUrlParsingResult extends ModulePathParsingResultBase {
  readonly kind: ModuleUrlKind.External
  readonly name: string
}

export type ModuleUrlParsingResult =
  InternalModuleUrlParsingResult |
  ExternalModuleUrlParsingResult
