import type { AnyFunction } from "@cutout/internal";
import type { TokenType } from "./constants.ts";

/**
 * @packageDocumentation
 * Types for the @cutout/jsx runtime.
 * These define the intermediate representation (IR) stream our JSX returns.
 *
 * Basically, every piece of data in our JSX tree is a token tuple of `[type, value]`.
 */

/**
 * The fundamental shape of a token in @cutout/jsx: a readonly tuple of `[type, value]`.
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
export type AnyToken<
  A extends TokenType = TokenType.UNKNOWN,
  T = unknown,
> = [A, T];

// -----------------------------------------------------------------------------
// System Tokens
// -----------------------------------------------------------------------------

export type SystemToken =
  | UnknownToken
  | GeneratorToken

/**
 * A token where we genuinely don't know the type or value yet.
 * Handy for initial parsing stages or error fallbacks.
 */
export type UnknownToken = AnyToken<
  TokenType.UNKNOWN,
  unknown
>;

/**
 * A token representing a generator.
 *
 * Generators are allow us to yield tokens
 * dynamically, which is great for streaming SSR or lazy evaluation.
 * It yields OutputCutoutTokens on demand.
 */
export type GeneratorToken = AnyToken<
  TokenType.GENERATOR,
  () => Generator<OutputToken>
>;

// -----------------------------------------------------------------------------
// Primitive Tokens
// -----------------------------------------------------------------------------

export type PrimitiveToken =
  | NullToken
  | UndefinedToken
  | BooleanToken
  | NumberToken
  | StringToken
  | SymbolToken

/**
 * A token for the literal null value.
 */
export type NullToken = AnyToken<TokenType.NULL, null>;

/**
 * A token for the literal undefined value.
 */
export type UndefinedToken = AnyToken<
  TokenType.UNDEFINED,
  undefined
>;

/**
 * A token wrapping a boolean value.
 */
export type BooleanToken = AnyToken<
  TokenType.BOOLEAN,
  boolean
>;

/**
 * A token wrapping a standard number.
 */
export type NumberToken = AnyToken<
  TokenType.NUMBER,
  number
>;

/**
 * A token wrapping a string, typically holding text content.
 */
export type StringToken = AnyToken<
  TokenType.STRING,
  string
>;

/**
 * A token for a symbol value.
 */
export type SymbolToken = AnyToken<
  TokenType.SYMBOL,
  symbol
>;

// -----------------------------------------------------------------------------
// References
// -----------------------------------------------------------------------------

export type ReferenceToken = 
  | ArrayToken
  | ObjectToken
  | FunctionToken

/**
 * A token wrapping an object.
 * Typically used for attribute containers.
 */
export type ObjectToken = AnyToken<
  TokenType.OBJECT,
  object
>;

/**
 * A token representing an array.
 * Usually contains children elements or mixed content.
 */
export type ArrayToken = AnyToken<
  TokenType.ARRAY,
  Array<unknown>
>;

/**
 * A token wrapping a function.
 *
 * In the context of JSX, this often represents a component definition or
 * event listener.
 */
export type FunctionToken = AnyToken<
  TokenType.FUNCTION,
  AnyFunction
>;

// -----------------------------------------------------------------------------
// Syntax
// -----------------------------------------------------------------------------

export type SyntaxToken =
  | ElementOpenToken
  | ElementCloseToken
  | AttributeToken

/**
 * A token representing the opening of a JSX element.
 * The value is the tag name (e.g., "div", "MyComponent").
 */
export type ElementOpenToken = AnyToken<
  TokenType.ELEMENT_OPEN,
  string
>;

/**
 * A token representing the closing of a JSX element.
 * The value is usually the tag name again, matching the opener.
 */
export type ElementCloseToken = AnyToken<
  TokenType.ELEMENT_CLOSE,
  string
>;

/**
 * A token for an attribute key.
 * Used when we need to explicitly tag a key inside an attribute object.
 */
export type AttributeToken = AnyToken<
  TokenType.ATTRIBUTE,
  string
>;

/**
 * These are the token types that are safe to format.
 *
 * Basically, everything except the Generator tokens (since those are internal
 * streams that actually _contain_ the output).
 */
export type OutputToken =
  | PrimitiveToken
  | ReferenceToken
  | SyntaxToken

/**
 * This covers every valid token you might encounter when working with `@cutout/jsx`.
 *
 * It includes the output-safe tokens plus the Generator tokens used for
 * internal processing and streaming logic.
 */
export type ValidToken =
  | OutputToken
  | GeneratorToken;
