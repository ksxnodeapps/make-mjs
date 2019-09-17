export type MaybePromise<X> = X | Promise<X>

export const REJECTION_SILENCER = (): void => undefined

/**
 * Silence a unhandled promise rejection warning
 * @param promise Promise to silence
 */
export function silenceRejection<X> (promise: Promise<X>) {
  void promise.catch(REJECTION_SILENCER)
  return promise
}

/**
 * Remove trailing `'/'` if there is one
 * @param path Path to be rid of trailing separator
 */
export function removeTrailingSeparator (path: string) {
  return path.endsWith('/')
    ? path.slice(0, -1)
    : path
}

/**
 * Like `path.join` but does not eliminate `'.'`
 * @param urlSegments Paths to join together
 */
export function joinUrl (...urlSegments: string[]) {
  return urlSegments
    .map(removeTrailingSeparator)
    .filter(Boolean)
    .join('/')
}

/**
 * Like `path.parse` but accept only `'/'` as separator
 * @param url Path to parse
 */
export function parseUrl (url: string): parseUrl.Result {
  if (url.endsWith('/')) return parseUrl(url.slice(0, -1))
  const segments = url.split('/')
  const base = segments.pop()
  if (!base) return { base: '', dir: '', name: '', ext: '' }
  const dir = segments.join('/')
  const [name, extWithoutDot] = base.split('.')
  const ext = extWithoutDot as any === undefined ? '' : ('.' + extWithoutDot)
  return { base, dir, name, ext }
}

export namespace parseUrl {
  export interface Result {
    dir: string
    base: string
    name: string
    ext: string
  }
}

const EXT_REGEX = /(\.[^\.]*)?$/

export function replacePathExtension (path: string, newExt: string) {
  return path.replace(EXT_REGEX, newExt)
}

export function * iterateAncestorDirectories (path: string) {
  const segments = path.split('/').filter(Boolean)

  while (segments.length) {
    segments.pop()
    yield joinUrl(...segments)
  }
}

/**
 * Returns a function that
 * takes an `x`,
 * returns `f(x)` if `f(x)` is falsy
 * or `g(x)` if `f(x)` is truthy
 * @param f First function to call
 * @param g Second function to call
 */
export function fnAnd<X, Y, Z> (
  f: (x: X) => Y,
  g: (x: X) => Z
): (x: X) => Y | Z {
  return x => f(x) && g(x)
}

/**
 * Returns a function that
 * takes an `x`,
 * returns `f(x)` if `f(x)` is truthy
 * or `g(x)` if `f(x)` is falsy
 * @param f First function to call
 * @param g Second function to call
 */
export function fnOr<X, Y, Z> (
  f: (x: X) => Y,
  g: (x: X) => Z
): (x: X) => Y | Z {
  return x => f(x) || g(x)
}
