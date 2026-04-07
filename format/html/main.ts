import { CutoutTokenType, FRAGMENT_LABEL } from "@cutout/jsx/tokens";

import type { CutoutFormatter } from "../types.ts";
import { escape } from "./escape.ts";

export const html: CutoutFormatter<string> = ([, generator]) => {
  let result = "";

  const context = {
    property: true,
    fragment: false,
  };

  for (const token of generator) {
    const [type, value] = token;

    switch (type) {
      case CutoutTokenType.ELEMENT_OPEN:
        if (value === FRAGMENT_LABEL) {
          context.fragment = true;
          break;
        }

        result += `<${escape(value)}`;
        context.fragment = false;
        break;
      case CutoutTokenType.ELEMENT_CLOSE:
        if (value === FRAGMENT_LABEL) {
          context.fragment = false;
          break;
        }

        // TODO(#17): Handle void elements properly.
        if (context.property) {
          result += ">";
          context.property = false;
        }

        result += `</${escape(value)}>`;
        break;
      case CutoutTokenType.PROPERTY:
        if (context.fragment) break;

        if (value === "children") {
          result += ">";
          context.property = false;
          break;
        }

        result += ` ${escape(value)}=`;
        context.property = true;
        break;
      case CutoutTokenType.STRING:
        result += context.property ? `"${escape(value)}"` : escape(value);
        break;
      case CutoutTokenType.NUMBER:
        result += String(value);
        break;
      case CutoutTokenType.SYMBOL:
        if (!context.property) break;

        result += `"${escape(value.description ?? "")}"`;
        break;
      case CutoutTokenType.BOOLEAN:
        if (!context.property) break;

        if (value) {
          // Remove stray `=`
          result = result.substring(0, result.length - 1);
        } else {
          result += '"false"';
        }
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
      case CutoutTokenType.NULL:
      case CutoutTokenType.UNDEFINED:
        break;
      default:
        throw new Error(`Unknown token type during HTML formatting: ${type}`);
    }
  }

  return result;
};
