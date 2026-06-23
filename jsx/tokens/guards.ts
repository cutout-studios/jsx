/**
 * @packageDocumentation
 *
 * These type guards allows `@cutout/jsx` to guarantee robust runtime data type consistency.
 */

import { TOKEN_LENGTH, TokenType } from "./constants.ts";
import type { GeneratorToken, OutputToken, ValidToken } from "./types.ts";

/**
 * A TypeScript guard for vaild (not unknown) Cutout Tokens.
 *
 * @param {unknown} value
 */
export const isValidToken = (
  value: unknown,
): value is ValidToken => isOutputToken(value) || isGeneratorToken(value);

/**
 * A TypeScript guard for Cutout Tokens that can be returned
 * from a Generator.
 *
 * @param {unknown} value
 */
export const isOutputToken = (
  value: unknown,
): value is OutputToken => {
  if (!Array.isArray(value)) return false;
  if (value.length !== TOKEN_LENGTH) return false;

  switch (value[0]) {
    case TokenType.NUMBER:
      return typeof value[1] === "number" || typeof value[1] === "bigint";
    case TokenType.ARRAY:
      return Array.isArray(value[1]);
    case TokenType.BOOLEAN:
      return typeof value[1] === "boolean";
    case TokenType.NULL:
      return value[1] === null;
    case TokenType.OBJECT:
      return typeof value[1] === "object";
    case TokenType.FUNCTION:
      return typeof value[1] === "function";
    case TokenType.ATTRIBUTE:
    case TokenType.ELEMENT_OPEN:
    case TokenType.ELEMENT_CLOSE:
    case TokenType.STRING:
      return typeof value[1] === "string";
    case TokenType.SYMBOL:
      return typeof value[1] === "symbol";
    case TokenType.UNDEFINED:
      return value[1] === undefined;
    case TokenType.UNKNOWN:
      return true;
  }

  return false;
};

/**
 * A TypeScript guard for Cutout Generator tokens.
 *
 * @param {unknown} value
 */
export const isGeneratorToken = (
  value: unknown,
): value is GeneratorToken => {
  if (!Array.isArray(value)) return false;
  if (value.length !== TOKEN_LENGTH) return false;

  return value[0] === TokenType.GENERATOR && isGeneratorFactory(value[1]);
};

const isGeneratorFactory = (value: unknown): value is () => Generator => {
  if (typeof value !== "function") {
    return false;
  }

  const maybeGenerator = value();

  return typeof maybeGenerator === "object" && maybeGenerator !== null &&
    "next" in maybeGenerator &&
    "return" in maybeGenerator && "throw" in maybeGenerator;
};
