/**
 * @packageDocumentation
 *
 * "tokenizeValue" is an important utilty: it transforms arbitrary JavaScript data into tokens.
 */

import type { AnyFunction } from "@cutout/internal";
import { TokenType } from "./constants.ts";
import type { OutputToken, UnknownToken } from "./types.ts";

/**
 * Attempts to convert an arbitrary value into a `CutoutToken`.
 *
 * @param {unknown} value The unknown value to convert.
 * @returns {OutputToken | UnknownToken}
 *
 * @example
 * ```ts
 * const [type, value] = tokenizeValue("hello");
 *   // type -> CutoutTokenType.String
 *   // value -> "hello"
 * ```
 */
export const tokenizeValue = (
  value: unknown,
): OutputToken | UnknownToken => {
  switch (typeof value) {
    case "bigint":
    case "number":
      return [TokenType.NUMBER, value as number];
    case "string":
      return [TokenType.STRING, value as string];
    case "boolean":
      return [TokenType.BOOLEAN, value as boolean];
    case "symbol":
      return [TokenType.SYMBOL, value as symbol];
    case "undefined":
      return [TokenType.UNDEFINED, undefined];
    case "function":
      return [TokenType.FUNCTION, value as AnyFunction];
    case "object":
      if (value === null) {
        return [TokenType.NULL, null];
      } else if (Array.isArray(value)) {
        return [TokenType.ARRAY, value];
      } else if (value instanceof Promise) {
        return [TokenType.PROMISE, value];
      }

      return [TokenType.OBJECT, value];
    default:
      return [TokenType.UNKNOWN, value];
  }
};
