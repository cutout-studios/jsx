import {
  CHILDREN_LABEL,
  CutoutTokenType,
  FRAGMENT_LABEL,
} from "@cutout/jsx/tokens";
import { CutoutError, CutoutErrorCode } from "@cutout/web";

import { VOID } from "../constants/elements.ts";
import { FUNCTION_SERIALIZATION } from "../constants/errorGuidance.ts";
import type { CutoutFormatter } from "../types.ts";
import { escape } from "./escape.ts";

const METADATA_PROPERTY_LOCATION = "data-xo-location";

const VOID_SET: Set<string> = new Set(VOID);

/**
 * A generic HTML formatter, for SSR.
 *
 * @param {CutoutGeneratorToken} generatorToken The Cutout JSX IR.
 * @returns {string} The formatted HTML.
 */
export const html: CutoutFormatter<Response> = ([, generator]) => {
  const state: _FormatState = {
    result: "",
    context: {
      property: true,
      fragment: false,
      location: false,
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
      case CutoutTokenType.ATTRIBUTE:
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
      case CutoutTokenType.FUNCTION:
        throw new CutoutError(CutoutErrorCode.OPERATION_INSECURE, {
          guidance: FUNCTION_SERIALIZATION,
          context: value,
        });

      default:
        throw new CutoutError(CutoutErrorCode.DATA_UNKNOWN, {
          context: value,
        });
    }
  }

  return new Response(state.result, {
    headers: {
      "content-type": "text/html; charset=utf-8",
    },
  });
};

type _FormatState = {
  result: string;
  context: {
    property: boolean;
    fragment: boolean;
    location: boolean;
  };
  location?: URL;
};

// Cognitive conveience methods
function _openElement(
  state: _FormatState,
  value: string,
) {
  if (value === FRAGMENT_LABEL) {
    return state.context.fragment = true;
  }

  state.result += `<${value}`;
  state.context.fragment = false;
}

function _closeElement(
  state: _FormatState,
  value: string,
) {
  if (value === FRAGMENT_LABEL) {
    return state.context.fragment = false;
  }

  if (state.context.property) {
    state.result += ">";
    state.context.property = false;
  }

  if (!VOID_SET.has(value)) {
    state.result += `</${value}>`;
  }
}

function _addProperty(
  state: _FormatState,
  value: string,
) {
  if (state.context.fragment) return;

  if (value === CHILDREN_LABEL) {
    state.result += ">";

    if (state.location) {
      state.result += // TODO: make relative to the app root
        `<script src="${state.location.pathname}" type="module" defer></script>`;
      state.location = undefined;
    }

    return state.context.property = false;
  }

  if (value === METADATA_PROPERTY_LOCATION) {
    state.context.location = true;
    return;
  }

  state.result += ` ${value}=`;
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

function _appendObject(
  state: _FormatState,
  value: object,
) {
  if (state.context.location) {
    state.location = value as URL;
    state.context.location = false;
    return;
  }

  state.result += `"${
    escape(JSON.stringify(value, (_, objectValue) => {
      if (typeof objectValue === "function") {
        throw new CutoutError(CutoutErrorCode.OPERATION_INSECURE, {
          guidance: FUNCTION_SERIALIZATION,
          context: objectValue,
        });
      }

      return objectValue;
    }))
  }"`;
}
