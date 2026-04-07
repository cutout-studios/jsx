import {
  type CutoutElementCloseToken,
  type CutoutElementOpenToken,
  type CutoutGeneratorToken,
  type CutoutPropertyToken,
  CutoutTokenType,
  FRAGMENT_LABEL,
  isValidCutoutToken,
  TOKEN_TYPE_INDEX,
  TOKEN_VALUE_INDEX,
  tokenizeValue,
  UNSERIALIZABLE_LABEL,
} from "@cutout/jsx/tokens";
import { CHILDREN_LABEL } from "../tokens/constants.ts";
import {
  isCutoutGeneratorToken,
  isOutputCutoutToken,
} from "../tokens/guards.ts";

// Must declare a namespace here for JSX to function.
// deno-lint-ignore no-namespace
export namespace JSX {
  // Formatters decide which nodes/properties are valid.
  export interface IntrinsicElements {
    // `{}` denotes a Fragment.
    // deno-lint-ignore ban-types
    [elementTag: string]: Record<string, unknown> | {};
  }
}

export const Fragment = FRAGMENT_LABEL;

export const jsx = (
  elementName: string,
  _elementProps: { [key: string]: unknown },
  ..._elementChildren: unknown[] // "react" pragma passes children as a list.
): CutoutGeneratorToken => {
  const _generator = function* () {
    yield [CutoutTokenType.ELEMENT_OPEN, elementName] as CutoutElementOpenToken;

    // Sanitize children across "react" and "react-jsx" pragma types.
    let { children, ...props } = _elementProps;
    children = children ?? _elementChildren;

    // These are both "single values" and need to be wrapped in an array for consistent processing.
    if (isValidCutoutToken(children) || !Array.isArray(children)) {
      children = [children];
    }

    for (const key in props) {
      yield [CutoutTokenType.PROPERTY, key] as CutoutPropertyToken;
      yield* _forwardTokens(props[key]);
    }

    // Children are a special property.
    if (Array.isArray(children) && children.length) {
      yield [CutoutTokenType.PROPERTY, CHILDREN_LABEL] as CutoutPropertyToken;

      for (const child of children as unknown[]) yield* _forwardTokens(child);
    }

    yield [
      CutoutTokenType.ELEMENT_CLOSE,
      elementName,
    ] as CutoutElementCloseToken;
  };

  return [CutoutTokenType.GENERATOR, _generator()];
};

// TODO(#3): implement `jsxs` and `jsxDEV`
export const jsxs = jsx;
export const jsxDEV = jsx;

function* _forwardTokens(value: unknown, debug = false) {
  if (isCutoutGeneratorToken(value)) {
    yield* value[TOKEN_VALUE_INDEX];
    return;
  }

  if (isOutputCutoutToken(value)) {
    yield value;
    return;
  }

  const token = tokenizeValue(value);

  if (token[TOKEN_TYPE_INDEX] !== CutoutTokenType.UNKNOWN) {
    yield token;
  }

  if (token[TOKEN_TYPE_INDEX] === CutoutTokenType.UNKNOWN && debug) {
    let unknownValue;

    try {
      unknownValue = JSON.stringify(value);
    } catch {
      unknownValue = UNSERIALIZABLE_LABEL;
    }

    console.warn(`Encountered unknown value "${unknownValue}". Skipping.`);
  }
}
