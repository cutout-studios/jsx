/** @internal */
export type AnyFunction = (...args: never[]) => unknown;

/** @internal */
export type AnyArray = Array<unknown>;

/** @internal */
export type AnyShape = Record<PropertyKey, unknown>;

/** @internal */
export type EmptyShape = Readonly<Record<PropertyKey, never>>;
