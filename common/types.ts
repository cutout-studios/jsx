export type AnyFunction = (...args: never[]) => unknown;
export type AnyArray = Readonly<Array<unknown>>;
export type AnyShape = Readonly<Record<PropertyKey, unknown>>;
export type EmptyShape = Readonly<Record<PropertyKey, never>>;
