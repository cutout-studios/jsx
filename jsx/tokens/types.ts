/**
 * @packageDocumentation
 * Types for the @cutout/jsx runtime.
 * These define the intermediate representation (IR) stream our JSX returns.
 *
 * Basically, every piece of data in our JSX tree is a token tuple of `[type, value]`.
 */

/**
 * The different "flavors" of tokens we track when processing JSX.
 *
 * @enum {number}
 */
export enum CutoutTokenType {
  // -- System --
  /** Something we haven't recognized yet. */
  UNKNOWN = 0x00,
  /** A token generator, used to stream JSX content progressively. */
  GENERATOR = 0x01,

  // --- JavaScript Primitives ---
  /** The literal undefined value. */
  UNDEFINED = 0x02,
  /** The literal null value. */
  NULL = 0x03,
  /** A simple true/false boolean. */
  BOOLEAN = 0x04,
  /** A string value (text content). */
  STRING = 0x05,
  /** A number value (integer/float, bigint). */
  NUMBER = 0x06,
  /** A JavaScript symbol. */
  SYMBOL = 0x07,

  // --- Complex Types ---
  /** An array of children or mixed content. */
  ARRAY = 0x08,
  /** A generic object (usually an attribute container). */
  OBJECT = 0x09,
  /** An element function, class, event listener, etc. */
  FUNCTION = 0x0A,

  // --- JSX Structure ---
  /** Marks the start of a JSX tag (e.g., `<div`). */
  ELEMENT_OPEN = 0x0B,
  /** Marks the end of a JSX tag (e.g., `</div>`). */
  ELEMENT_CLOSE = 0x0C,
  /** A JSX element attribute (e.g. `class=`). */
  ATTRIBUTE = 0x0D,
}

/**
 * The fundamental shape of a token in @cutout/jsx: a tuple of `[type, value]`.
 *
 * @template A The token type (default: `CutoutTokenType.UNKNOWN`).
 * @template T The actual data payload (default: `unknown`).
 *
 * @example
 * ```ts
 * // A simple number token
 * const token: AnyCutoutToken<CutoutTokenType.NUMBER, number> = [0x03, 42];
 * ```
 */
export type AnyCutoutToken<
  A extends CutoutTokenType = CutoutTokenType.UNKNOWN,
  T = unknown,
> = [A, T];

// -----------------------------------------------------------------------------
// System Tokens
// -----------------------------------------------------------------------------

/**
 * A token where we genuinely don't know the type or value yet.
 * Handy for initial parsing stages or error fallbacks.
 */
export type UnknownCutoutToken = AnyCutoutToken<
  CutoutTokenType.UNKNOWN,
  unknown
>;

/**
 * A token representing a generator.
 *
 * Generators are allow us to yield tokens
 * dynamically, which is great for streaming SSR or lazy evaluation.
 * It yields OutputCutoutTokens on demand.
 */
export type CutoutGeneratorToken = AnyCutoutToken<
  CutoutTokenType.GENERATOR,
  Generator<CutoutOutputToken>
>;

// -----------------------------------------------------------------------------
// JavaScript Primitives
// -----------------------------------------------------------------------------

/**
 * A token for the literal null value.
 */
export type CutoutNullToken = AnyCutoutToken<CutoutTokenType.NULL, null>;

/**
 * A token for the literal undefined value.
 */
export type CutoutUndefinedToken = AnyCutoutToken<
  CutoutTokenType.UNDEFINED,
  undefined
>;

/**
 * A token wrapping a boolean value.
 */
export type CutoutBooleanToken = AnyCutoutToken<
  CutoutTokenType.BOOLEAN,
  boolean
>;

/**
 * A token wrapping a standard number.
 */
export type CutoutNumberToken = AnyCutoutToken<
  CutoutTokenType.NUMBER,
  number
>;

/**
 * A token wrapping a string, typically holding text content.
 */
export type CutoutStringToken = AnyCutoutToken<
  CutoutTokenType.STRING,
  string
>;

/**
 * A token for a symbol value.
 */
export type CutoutSymbolToken = AnyCutoutToken<
  CutoutTokenType.SYMBOL,
  symbol
>;

// -----------------------------------------------------------------------------
// Complex Types
// -----------------------------------------------------------------------------

/**
 * A token wrapping an object.
 * Typically used for attribute containers.
 */
export type CutoutObjectToken = AnyCutoutToken<
  CutoutTokenType.OBJECT,
  object
>;

/**
 * A token representing an array.
 * Usually contains children elements or mixed content.
 */
export type CutoutArrayToken = AnyCutoutToken<
  CutoutTokenType.ARRAY,
  Array<unknown>
>;

/**
 * A function with unknown arguments and return.
 */
export type AnyFunction = (...args: unknown[]) => unknown;

/**
 * A token wrapping a function.
 *
 * In the context of JSX, this often represents a component definition or
 * event listener.
 */
export type CutoutFunctionToken = AnyCutoutToken<
  CutoutTokenType.FUNCTION,
  AnyFunction
>;

// -----------------------------------------------------------------------------
// JSX Structure
// -----------------------------------------------------------------------------

/**
 * A token representing the opening of a JSX element.
 * The value is the tag name (e.g., "div", "MyComponent").
 */
export type CutoutElementOpenToken = AnyCutoutToken<
  CutoutTokenType.ELEMENT_OPEN,
  string
>;

/**
 * A token representing the closing of a JSX element.
 * The value is usually the tag name again, matching the opener.
 */
export type CutoutElementCloseToken = AnyCutoutToken<
  CutoutTokenType.ELEMENT_CLOSE,
  string
>;

/**
 * A token for an attribute key.
 * Used when we need to explicitly tag a key inside an attribute object.
 */
export type CutoutAttributeToken = AnyCutoutToken<
  CutoutTokenType.ATTRIBUTE,
  string
>;

/**
 * These are the token types that are safe to format.
 *
 * Basically, everything except the Generator tokens (since those are internal
 * streams that actually _contain_ the output).
 */
export type CutoutOutputToken =
  | CutoutArrayToken
  | CutoutBooleanToken
  | CutoutElementCloseToken
  | CutoutElementOpenToken
  | CutoutFunctionToken
  | CutoutNullToken
  | CutoutNumberToken
  | CutoutObjectToken
  | CutoutAttributeToken
  | CutoutStringToken
  | CutoutSymbolToken
  | CutoutUndefinedToken;

/**
 * This covers every valid token you might encounter when working with `@cutout/jsx`.
 *
 * It includes the output-safe tokens plus the Generator tokens used for
 * internal processing and streaming logic.
 */
export type ValidCutoutToken =
  | CutoutOutputToken
  | CutoutGeneratorToken;
