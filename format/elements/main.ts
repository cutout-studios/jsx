import {
  CHILDREN_LABEL,
  CutoutTokenType,
  FRAGMENT_LABEL,
} from "@cutout/jsx/tokens";
import type { CutoutFormatter } from "../types.ts";

/**
 * A formatter that creates a collection of DOM element objects, for
 * client-side rendering.
 *
 * @param {CutoutGeneratorToken} generatorToken The Cutout JSX IR.
 * @returns {HTMLCollection} The created DOM element objects.
 */
export const elements: CutoutFormatter<HTMLCollection> = (
  [, generator],
): HTMLCollection => {
  const state: _FormatState = {
    root: globalThis.document.createDocumentFragment(),
    stack: [],
    pointers: {},
  };

  for (const [type, value] of generator) {
    switch (type) {
      case CutoutTokenType.ELEMENT_OPEN:
        _openElement(state, value);
        break;
      case CutoutTokenType.ELEMENT_CLOSE:
        _closeElement(state);
        break;
      case CutoutTokenType.PROPERTY:
        _targetAttribute(state, value);
        break;
      case CutoutTokenType.NUMBER:
      case CutoutTokenType.STRING:
      case CutoutTokenType.BOOLEAN:
        _handlePrimitive(state, value);
        break;
      case CutoutTokenType.OBJECT:
      case CutoutTokenType.ARRAY:
        _handleObject(state, value);
        break;
      case CutoutTokenType.FUNCTION:
        // NOTE: this should _generally_ be fine, but it may evenutally
        // behoove us to memoize these intermediate listener functions
        // and/or attach an abort controller to the element
        _addEventListener(state, (event: Event) => value(event));
        break;
      case CutoutTokenType.SYMBOL:
      case CutoutTokenType.NULL:
      case CutoutTokenType.UNDEFINED:
      default:
        break;
    }
  }

  return state.root.children;
};

type _FormatState = {
  root: DocumentFragment;
  stack: HTMLElement[];
  pointers: {
    element?: HTMLElement;
    attribute?: string;
  };
};

// Cognitive convenience methods
function _openElement(
  state: _FormatState,
  value: string,
) {
  if (value === FRAGMENT_LABEL) return;

  const previous = state.pointers.element ?? state.root;

  state.pointers.element = globalThis.document.createElement(value);

  state.stack.push(state.pointers.element);
  previous.appendChild(state.pointers.element);
}

function _closeElement(
  state: _FormatState,
) {
  state.stack.pop();
  state.pointers.element = state.stack.at(-1);
}

function _targetAttribute(state: _FormatState, value: string) {
  if (value === CHILDREN_LABEL) {
    return state.pointers.attribute = undefined;
  }

  state.pointers.attribute = value;
}

function _handlePrimitive(
  state: _FormatState,
  value: string | number | boolean,
) {
  if (state.pointers.attribute) {
    return state.pointers.element?.setAttribute(
      state.pointers.attribute,
      typeof value === "boolean" && value ? "" : String(value),
    );
  }

  _appendTextNode(state, value);
}

function _handleObject(state: _FormatState, value: object) {
  if (state.pointers.attribute) {
    return Object.defineProperty(
      state.pointers.element,
      state.pointers.attribute,
      { value },
    );
  }

  _appendTextNode(state, value);
}

function _appendTextNode(state: _FormatState, value: unknown) {
  if (!state.pointers.element) return;

  state.pointers.element.appendChild(
    globalThis.document.createTextNode(
      typeof value === "object" ? JSON.stringify(value) : String(value),
    ),
  );
}

function _addEventListener(state: _FormatState, value: EventListener) {
  if (!state.pointers.element || !state.pointers.attribute) return;

  state.pointers.element.addEventListener(
    state.pointers.attribute.replace(/^on/, ""),
    value,
  );
}
