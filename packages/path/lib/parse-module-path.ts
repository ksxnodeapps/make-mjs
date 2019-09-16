import {
  ModulePathKind,
  ModulePathParsingResultBase,
  InternalModulePathParsingResult,
  ExternalModulePathParsingResult,
  ModulePathParsingResult
} from '../utils/module-parsing-result'

export {
  ModulePathKind,
  InternalModulePathParsingResult,
  ExternalModulePathParsingResult,
  ModulePathParsingResult
}

abstract class Base<
  Kind extends ModulePathKind,
  Name extends string | null
> implements ModulePathParsingResultBase {
  abstract readonly kind: Kind
  constructor (
    public readonly name: Name,
    public readonly path: string
  ) {}
}

class Internal
extends Base<ModulePathKind.Internal, null>
implements InternalModulePathParsingResult {
  public readonly kind = ModulePathKind.Internal
}

class External
extends Base<ModulePathKind.External, string>
implements ExternalModulePathParsingResult {
  public readonly kind = ModulePathKind.External
}

const INTERNAL_PREFIXES = ['.', '..', '~', '/']

export function parseModulePath (path: string): ModulePathParsingResult {
  const [first, second] = path.split('/')
  if (INTERNAL_PREFIXES.includes(first)) return new Internal(null, path)
  if (first.startsWith('@')) return new External(first + '/' + second, path)
  return new External(first, path)
}

export default parseModulePath
