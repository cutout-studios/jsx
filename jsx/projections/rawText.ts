import {
  CUTOUT_CHILDREN_LABEL,
  CUTOUT_FRAGMENT_LABEL,
  CutoutTokenType,
} from "@cutout/jsx/tokens";

import type { Projection } from "./types.ts";

/**
 * A spartan projection that attempts to provide an as-close-to-the-source as possible text representation of the provided JSX.
 *
 * > [!NOTE]
 * > The result is raw - not escaped, nor processed in any intelligent way. Do NOT consume it insecurely.
 *
 * @param JSX The JSX IR to project.
 * @returns The raw JSX text.
 *
 * @example
 * ```tsx
 * rawText(<div></div>); // => "<div></div>"
 * ```
 */
export const rawText: Projection<string> = (jsx): string => {
  const state: _FormatState = {
    result: "",
    context: {
      property: false,
      fragment: false,
    },
  };

  for (const [type, value] of jsx[1]()) {
    switch (type) {
      case CutoutTokenType.ELEMENT_OPEN:
        _openElement(state, value);
        break;
      case CutoutTokenType.ELEMENT_CLOSE:
        _closeElement(state, value);
        break;
      case CutoutTokenType.ATTRIBUTE:
        _addAttribute(state, value);
        break;
      case CutoutTokenType.STRING:
      case CutoutTokenType.SYMBOL:
      case CutoutTokenType.FUNCTION:
      case CutoutTokenType.OBJECT:
      case CutoutTokenType.ARRAY:
      case CutoutTokenType.BOOLEAN:
      case CutoutTokenType.NUMBER:
        _addAttributeValue(state, value);
        break;
      case CutoutTokenType.NULL:
      case CutoutTokenType.UNDEFINED:
      case CutoutTokenType.PROMISE:
      default:
        break;
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

// Cognitive convenience methods
function _openElement(
  state: _FormatState,
  value: string,
) {
  if (value === CUTOUT_FRAGMENT_LABEL) {
    return state.context.fragment = true;
  }

  state.result += `<${value}`;
  state.context.fragment = false;
  state.context.property = true;
}

function _closeElement(
  state: _FormatState,
  value: string,
) {
  if (value === CUTOUT_FRAGMENT_LABEL) {
    return state.context.fragment = false;
  }

  if (state.context.property) {
    state.result += ">";
    state.context.property = false;
  }

  state.result += `</${value}>`;
}

function _addAttribute(
  state: _FormatState,
  value: string,
) {
  if (state.context.fragment) return;

  if (value === CUTOUT_CHILDREN_LABEL) {
    state.result += ">";
    return state.context.property = false;
  }

  state.result += ` ${value}=`;
  state.context.property = true;
}

function _addAttributeValue(state: _FormatState, value: unknown) {
  value = String(value);

  if (state.context.property) {
    return state.result += `"${value}"`;
  }

  state.result += value;
}
