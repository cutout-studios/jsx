import {
  type AnyFunction,
  type CutoutOutputToken,
  CutoutTokenType,
  type UnknownCutoutToken,
} from "./types.ts";

/**
 * Attempts to convert an arbitrary value into a `CutoutToken`.
 *
 * @param {unknown} value The unknown value to convert.
 * @returns {CutoutOutputToken | UnknownCutoutToken}
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
): CutoutOutputToken | UnknownCutoutToken => {
  switch (typeof value) {
    case "bigint":
    case "number":
      return [CutoutTokenType.NUMBER, value as number];
    case "string":
      return [CutoutTokenType.STRING, value as string];
    case "boolean":
      return [CutoutTokenType.BOOLEAN, value as boolean];
    case "symbol":
      return [CutoutTokenType.SYMBOL, value as symbol];
    case "undefined":
      return [CutoutTokenType.UNDEFINED, undefined];
    case "function":
      return [CutoutTokenType.FUNCTION, value as AnyFunction];
    case "object":
      if (value === null) {
        return [CutoutTokenType.NULL, null];
      } else if (Array.isArray(value)) {
        return [CutoutTokenType.ARRAY, value];
      }

      return [CutoutTokenType.OBJECT, value];
    default:
      return [CutoutTokenType.UNKNOWN, value];
  }
};
