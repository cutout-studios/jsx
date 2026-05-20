/**
 * @internal
 * A generic function type that accepts any arguments and returns an unknown value.
 * Typically used for callbacks or generic function references where specific typing is not required.
 */
export type AnyFunction = (...args: never[]) => unknown;

/**
 * @internal
 * A generic array type that can hold elements of any type.
 */
export type AnyArray = Array<unknown>;

/**
 * @internal
 * A generic object type that can hold any key-value pairs with unknown values.
 */
export type AnyShape = Record<PropertyKey, unknown>;

/**
 * @internal
 * A generic object type that cannot hold any values.
 * Useful for enforcing empty objects or interfaces.
 */
export type EmptyShape = Readonly<Record<PropertyKey, never>>;
