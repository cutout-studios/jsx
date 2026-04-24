/**
 * @packageDocumentation
 * Internal constants for the @cutout/jsx runtime.
 *
 * These define the magic numbers and labels used to structure tokens and handle
 * special JSX cases.
 */

// ------------------------------------------------------------
// Token Tuple Structure
// ------------------------------------------------------------

/**
 * The expected length of a valid token tuple.
 *
 * Tokens are structured as `[Type, Value]`: this is always 2.
 * Handy for validation checks.
 *
 * @example
 * ```ts
 * const token = [0x07, 42];
 * ```
 */
export const TOKEN_LENGTH = 2;

/**
 * The index of the type discriminator in a token tuple.
 *
 * This constant points to `Type`.
 *
 * @example
 * ```ts
 * const type = token[TOKEN_TYPE_INDEX]; // 0x07 (NUMBER)
 * ```
 */
export const TOKEN_TYPE_INDEX = 0;

/**
 * The index of the payload in a token tuple.
 *
 * This constant points to `Value`.
 *
 * @example
 * ```ts
 * const value = token[TOKEN_VALUE_INDEX]; // "hello!"
 * ```
 */
export const TOKEN_VALUE_INDEX = 1;

// ------------------------------------------------------------
// Internal Labels
// ------------------------------------------------------------

/**
 * The internal property key used to store children in a component.
 *
 * When we flatten JSX into our IR, children need to live somewhere specific
 * so they don't get mixed up with regular props. We use this label to
 * distinguish them.
 */
export const CHILDREN_LABEL = "[[CHILDREN]]";

/**
 * The identifier for the `Fragment` component.
 *
 * In JSX, `Fragment` lets you group elements without adding a DOM node.
 * This label represents that component internally so we can recognize
 * and handle it during transformation.
 */
export const FRAGMENT_LABEL = "[[FRAGMENT]]";

/**
 * A fallback label for values that can't be serialized.
 *
 * If we hit a value we don't know how to convert to a token (like a
 * function that isn't a component, or a circular reference), we swap
 * it out for this label during debugging/serialization so we don't crash.
 */
export const UNSERIALIZABLE_LABEL = "[[UNSERIALIZABLE]]";
