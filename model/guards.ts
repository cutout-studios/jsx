import { TOKEN_LENGTH } from "./constants.ts";
import { type ValidCutoutToken, CutoutTypeAnnotation } from "./types.ts";


export const isValidCutoutToken = (
  value: unknown
): value is ValidCutoutToken => {
  if (!Array.isArray(value)) return false;
  if (value.length !== TOKEN_LENGTH) return false;

  switch(value[0]) {
    case CutoutTypeAnnotation.NUMBER:
      return typeof value[1] === "number" || typeof value[1] === "bigint";
    case CutoutTypeAnnotation.ARRAY:
      return Array.isArray(value[1]);
    case CutoutTypeAnnotation.BOOLEAN:
      return typeof value[1] === "boolean";
    case CutoutTypeAnnotation.FRAGMENT:
    case CutoutTypeAnnotation.NULL:
    case CutoutTypeAnnotation.CHILD_START:
    case CutoutTypeAnnotation.CHILD_END:
      return value[1] === null;
    case CutoutTypeAnnotation.OBJECT:
      return typeof value[1] === "object";
    case CutoutTypeAnnotation.FUNCTION:
      return typeof value[1] === "function";
    case CutoutTypeAnnotation.PROPERTY:
    case CutoutTypeAnnotation.ELEMENT:
    case CutoutTypeAnnotation.STRING:
      return typeof value[1] === "string";
    case CutoutTypeAnnotation.SYMBOL:
      return typeof value[1] === "symbol";
    case CutoutTypeAnnotation.UNDEFINED:
      return value[1] === undefined;
    case CutoutTypeAnnotation.UNKNOWN:
      return true;
    case CutoutTypeAnnotation.GENERATOR:
      return isGenerator(value[1]);
  }

  return false;
}

const isGenerator = (value: unknown): value is Generator => {
  return typeof value === "object" && value !== null && "next" in value &&
    "return" in value && "throw" in value;
};
