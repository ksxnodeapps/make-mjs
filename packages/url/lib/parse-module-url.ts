import {
  ModuleUrlKind,
  ModulePathParsingResultBase,
  InternalModuleUrlParsingResult,
  ExternalModuleUrlParsingResult,
  ModuleUrlParsingResult,
} from '../utils/module-url-parsing-result'

export {
  ModuleUrlKind,
  InternalModuleUrlParsingResult,
  ExternalModuleUrlParsingResult,
  ModuleUrlParsingResult,
}

abstract class Base<
  Kind extends ModuleUrlKind,
  Name extends string | null,
> implements ModulePathParsingResultBase {
  abstract readonly kind: Kind
  constructor(
    public readonly name: Name,
    public readonly path: string,
  ) {}
}

class Internal extends Base<ModuleUrlKind.Internal, null> implements InternalModuleUrlParsingResult {
  public readonly kind = ModuleUrlKind.Internal
}

class External extends Base<ModuleUrlKind.External, string> implements ExternalModuleUrlParsingResult {
  public readonly kind = ModuleUrlKind.External
}

const INTERNAL_PREFIXES = ['.', '..', '~', '/']

export function parseModuleUrl(path: string): ModuleUrlParsingResult {
  const [first, second] = path.split('/')
  if (INTERNAL_PREFIXES.includes(first)) return new Internal(null, path)
  if (first.startsWith('@')) return new External(first + '/' + second, path)
  return new External(first, path)
}

export default parseModuleUrl
