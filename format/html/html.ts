import { CutoutTokenType, FRAGMENT_LABEL } from "@cutout/jsx/tokens";

import type { CutoutFormatter } from "../types.ts";
import { escape } from "./escape.ts";

export const html: CutoutFormatter<string> = ([, generator]) => {
  let result = "";

  let inPropertyContext = true;
  let inFragmentContext = false;
  for (const token of generator) {
    const [type, value] = token;

    switch (type) {
      case CutoutTokenType.ELEMENT_OPEN:
        if (value === FRAGMENT_LABEL) {
          inFragmentContext = true;
          break;
        }

        inFragmentContext = false;
        result += `<${escape(value)}`;
        break;
      // TODO(#17): Handle void elements properly.
      case CutoutTokenType.ELEMENT_CLOSE:
        if (value === FRAGMENT_LABEL) {
          inFragmentContext = false;
          break;
        }

        result += inPropertyContext
          ? `></${escape(value)}>`
          : `</${escape(value)}>`;
        break;
      case CutoutTokenType.PROPERTY:
        inPropertyContext = true;

        if (value === "children") {
          inPropertyContext = false;

          if (inFragmentContext) {
            result += "";
            break;
          }

          result += ">";
          break;
        }

        result += ` ${value}=`;
        break;
      case CutoutTokenType.STRING:
        result += inPropertyContext ? `"${escape(value)}"` : escape(value);
        break;
      case CutoutTokenType.SYMBOL:
        result += inPropertyContext
          ? `"${escape(value.description ?? "")}"`
          : "";
        break;
      case CutoutTokenType.NUMBER:
        result += String(value);
        break;
      case CutoutTokenType.BOOLEAN:
        // Remove stray `=`
        if (value && inPropertyContext) {
          result = result.substring(0, result.length - 1);
          break;
        }

        result += inPropertyContext ? '"false"' : "";
        break;
      case CutoutTokenType.NULL:
      case CutoutTokenType.UNDEFINED:
        break;
      // TODO(#10): detect functions within objects and arrays and throw an error, since these won't be properly serialized and will cause data loss.
      case CutoutTokenType.ARRAY:
      case CutoutTokenType.OBJECT:
        result += `"${escape(JSON.stringify(value))}"`;
        break;
      case CutoutTokenType.FUNCTION:
        throw new Error(
          `Cannot encode function token - functions cannot be securely serialized. Consider writing a custom format or transforming the function into a serializable value.`,
        );
      case CutoutTokenType.GENERATOR:
        throw new Error(
          `Cannot encode generator token - generators must be fully consumed and their tokens encoded separately.`,
        );
      default:
        throw new Error(`Unknown token type during HTML formatting: ${type}`);
    }
  }

  return result;
};
