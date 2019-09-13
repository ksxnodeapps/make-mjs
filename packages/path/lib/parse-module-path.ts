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

export function parseModulePath (path: string): ModulePathParsingResult {
  const [name] = path.split('/')
  return ['.', '..', '~', '/'].includes(name)
    ? new Internal(null, path)
    : new External(name, path)
}

export default parseModulePath
