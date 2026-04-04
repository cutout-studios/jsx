import {
  CutoutTokenType,
  type UnknownCutoutToken,
  type ValidCutoutToken,
} from "./types.ts";

export const tokenizeValue = (
  value: unknown,
): ValidCutoutToken | UnknownCutoutToken => {
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
      return [CutoutTokenType.FUNCTION, value];
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
