interface Options {
  readonly modulePath: string
}

export function isInternalModule (options: Options): boolean {
  const { modulePath } = options
  return modulePath.startsWith('./') || modulePath.startsWith('../')
}

export default isInternalModule
