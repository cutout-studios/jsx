import {
  CHILDREN_LABEL,
  CutoutTokenType,
  FRAGMENT_LABEL,
} from "@cutout/jsx/tokens";

import type { CutoutFormatter } from "../types.ts";
import { escape } from "./escape.ts";

export const html: CutoutFormatter<string> = ([, generator]) => {
  const state: _FormatState = {
    result: "",
    context: {
      property: true,
      fragment: false,
    },
  };

  for (const [type, value] of generator) {
    switch (type) {
      case CutoutTokenType.ELEMENT_OPEN:
        _openElement(state, value);
        break;
      case CutoutTokenType.ELEMENT_CLOSE:
        _closeElement(state, value);
        break;
      case CutoutTokenType.PROPERTY:
        _addProperty(state, value);
        break;
      case CutoutTokenType.STRING:
        _appendString(state, value);
        break;
      case CutoutTokenType.BOOLEAN:
        _appendBoolean(state, value);
        break;
      case CutoutTokenType.ARRAY:
      case CutoutTokenType.OBJECT:
        _appendObject(state, value);
        break;
      case CutoutTokenType.NUMBER:
        state.result += String(value);
        break;
      case CutoutTokenType.SYMBOL:
      case CutoutTokenType.NULL:
      case CutoutTokenType.UNDEFINED:
        break;
      // TODO(#21): Basic error system
      case CutoutTokenType.FUNCTION:
        throw new Error(`
          Functions tokens cannot be securely stringified.
          Consider writing a custom format or transforming the function into a serializable value.
        `);
      default:
        throw new Error(
          `Unknown or unformattable token type encountered during HTML formatting: "${type}"`,
        );
    }
  }

  return state.result;
};

type _FormatState = {
  result: string;
  context: {
    property: boolean;
    fragment: boolean;
  };
};

// Cognitive conveience methods
function _openElement(
  state: _FormatState,
  value: string,
) {
  if (value === FRAGMENT_LABEL) {
    return state.context.fragment = true;
  }

  state.result += `<${escape(value)}`;
  state.context.fragment = false;
}

function _closeElement(
  state: _FormatState,
  value: string,
) {
  if (value === FRAGMENT_LABEL) {
    return state.context.fragment = false;
  }

  // TODO(#17): Handle void elements properly.
  if (state.context.property) {
    state.result += ">";
    state.context.property = false;
  }

  state.result += `</${escape(value)}>`;
}

function _addProperty(
  state: _FormatState,
  value: string,
) {
  if (state.context.fragment) return;

  if (value === CHILDREN_LABEL) {
    state.result += ">";
    return state.context.property = false;
  }

  state.result += ` ${escape(value)}=`;
  state.context.property = true;
}

function _appendBoolean(
  state: _FormatState,
  value: boolean,
) {
  if (!state.context.property) return;

  if (value) { // Remove the "="
    return state.result = state.result.substring(0, state.result.length - 1);
  }

  state.result += '"false"';
}

function _appendString(
  state: _FormatState,
  value: string,
) {
  if (state.context.property) {
    return state.result += `"${escape(value)}"`;
  }

  state.result += escape(value);
}

// TODO(#10): detect functions within objects and arrays and throw an error,
// since these won't be properly serialized and will cause data loss.
function _appendObject(
  state: _FormatState,
  value: object,
) {
  state.result += `"${escape(JSON.stringify(value))}"`;
}
