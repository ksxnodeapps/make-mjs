import { Assign } from 'utility-types'

type NullObject<X> = X extends null ? {} : X

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

type ObjectExtends<
  Proto extends object | null,
  Properties extends object | null
> = Assign<
  NullObject<Proto>,
  NullObject<Properties>
>

/**
 * Create an object with `proto` as prototype
 * and `properties` as own properties
 * @param proto Prototype to extends upon
 * @param properties Properties to add
 */
export function objectExtends<
  Proto extends object | null,
  Properties extends object | null
> (
  proto: Proto,
  properties: Properties
): ObjectExtends<Proto, Properties> {
  return Object.assign(
    Object.create(proto),
    properties
  )
}

type AddProperty<
  Proto extends object | null,
  Key extends string | number | symbol,
  Value
> = ObjectExtends<Proto, {
  [key in Key]: Value
}>

/**
 * Create an object with `proto` as prototype
 * and `[key]: value` as the only own properties
 * @param proto Prototype to extends upon
 * @param key Property key
 * @param value Property value
 */
export function addProperty<
  Proto extends object | null,
  Key extends string | number | symbol,
  Value
> (
  proto: Proto,
  key: Key,
  value: Value
): AddProperty<Proto, Key, Value> {
  const object = Object.create(proto)
  object[key] = value
  return object
}
