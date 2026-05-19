export type AnyFunction = (...args: never[]) => unknown;
export type AnyArray = Array<unknown>;
export type AnyShape = Record<PropertyKey, unknown>;
export type EmptyShape = Readonly<Record<PropertyKey, never>>;
