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
 * @param paths Paths to join together
 */
export function joinPath (...paths: string[]) {
  return paths
    .map(removeTrailingSeparator)
    .join('/')
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
