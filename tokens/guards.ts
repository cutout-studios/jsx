import { TOKEN_LENGTH } from "./constants.ts";
import { CutoutTokenType, type ValidCutoutToken } from "./types.ts";

export const isValidCutoutToken = (
  value: unknown,
): value is ValidCutoutToken => {
  if (!Array.isArray(value)) return false;
  if (value.length !== TOKEN_LENGTH) return false;

  switch (value[0]) {
    case CutoutTokenType.NUMBER:
      return typeof value[1] === "number" || typeof value[1] === "bigint";
    case CutoutTokenType.ARRAY:
      return Array.isArray(value[1]);
    case CutoutTokenType.BOOLEAN:
      return typeof value[1] === "boolean";
    case CutoutTokenType.NULL:
      return value[1] === null;
    case CutoutTokenType.OBJECT:
      return typeof value[1] === "object";
    case CutoutTokenType.FUNCTION:
      return typeof value[1] === "function";
    case CutoutTokenType.PROPERTY:
    case CutoutTokenType.ELEMENT_OPEN:
    case CutoutTokenType.ELEMENT_CLOSE:
    case CutoutTokenType.STRING:
      return typeof value[1] === "string";
    case CutoutTokenType.SYMBOL:
      return typeof value[1] === "symbol";
    case CutoutTokenType.UNDEFINED:
      return value[1] === undefined;
    case CutoutTokenType.UNKNOWN:
      return true;
    case CutoutTokenType.GENERATOR:
      return isGenerator(value[1]);
  }

  return false;
};

const isGenerator = (value: unknown): value is Generator => {
  return typeof value === "object" && value !== null && "next" in value &&
    "return" in value && "throw" in value;
};
