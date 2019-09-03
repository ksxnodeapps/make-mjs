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
