/**
 * @packageDocumentation
 * The runtime implementation for the @cutout/jsx pragma.
 *
 * This is where the magic happens. It transforms standard JSX syntax (like
 * `<div>Hello</div>`) into our custom token stream using generators.
 * Think of this as the bridge between TypeScript's JSX emission and our
 * intermediate representation (IR).
 */

import {
  CHILDREN_LABEL,
  type CutoutElementCloseToken,
  type CutoutElementOpenToken,
  type CutoutGeneratorToken,
  type CutoutPropertyToken,
  CutoutTokenType,
  FRAGMENT_LABEL,
  isCutoutGeneratorToken,
  isOutputCutoutToken,
  isValidCutoutToken,
  TOKEN_TYPE_INDEX,
  TOKEN_VALUE_INDEX,
  tokenizeValue,
  UNSERIALIZABLE_LABEL,
} from "../tokens/module.ts";

/**
 * The core transformation function for our JSX pragma.
 *
 * This is what TypeScript calls when it sees `<MyComponent prop="value">child</MyComponent>`.
 * Instead of returning a virtual DOM node, we return a `CutoutGeneratorToken`.
 * This allows us to lazily evaluate the component tree, which is huge for
 * streaming SSR and memory efficiency.
 *
 * @param elementName The tag name or component function (e.g., "div" or `MyComponent`).
 * @param _elementProps The props object passed to the component.
 * @param _elementChildren Child elements.
 *   Note: The "react" pragma passes children as a separate list, while
 *   "react-jsx" includes them inside props. We handle both cases here.
 *
 * @returns A generator token representing the element structure.
 */
export const jsx = (
  elementName: string,
  _elementProps: { [key: string]: unknown },
  ..._elementChildren: unknown[]
): CutoutGeneratorToken => {
  const _generator = function* () {
    // 1. Yield the opening tag.
    yield [CutoutTokenType.ELEMENT_OPEN, elementName] as CutoutElementOpenToken;

    // 2. Normalize children across "react" and "react-jsx" pragma types.
    //    We separate children from the rest of the props to handle them separately.
    let { children, ...props } = _elementProps;
    children = children ?? _elementChildren;

    // These are both "single values" and need to be wrapped in an array
    // for consistent processing later.
    if (isValidCutoutToken(children) || !Array.isArray(children)) {
      children = [children];
    }

    // 3. Yield all non-child props.
    for (const key in props) {
      yield [CutoutTokenType.PROPERTY, key] as CutoutPropertyToken;
      yield* _forwardTokens(props[key]);
    }

    // 4. Yield children.
    if (Array.isArray(children) && children.length) {
      yield [CutoutTokenType.PROPERTY, CHILDREN_LABEL] as CutoutPropertyToken;

      for (const child of children as unknown[]) yield* _forwardTokens(child);
    }

    // 5. Yield the closing tag.
    yield [
      CutoutTokenType.ELEMENT_CLOSE,
      elementName,
    ] as CutoutElementCloseToken;
  };

  return [CutoutTokenType.GENERATOR, _generator()];
};

/**
 * Aliases for the main `jsx` function.
 *
 * Babel and TypeScript might call `jsxs` or `jsxDEV` depending on your
 * pragma settings, but for now, they all point to our main implementation.
 *
 * TODO(#3): properly implement `jsxs` and `jsxDEV`
 */
export const jsxs: typeof jsx = jsx;

/**
 * See `jsxs`.
 */
export const jsxDEV: typeof jsx = jsx;

/**
 * The special "Fragment" component.
 *
 * In JSX, this lets you group elements without adding an extra wrapper to the
 * DOM. Here, it's just an alias for our fragment label.
 */
export const Fragment: string = FRAGMENT_LABEL;

/**
 * The default @cutout/jsx typings.
 *
 * Without knowing how you want to format your JSX,
 * we must allow all elements and attributes:
 * otherwise nothing will work!
 */
// deno-lint-ignore no-namespace
export namespace JSX {
  /**
   * `IntrinsicElements` must be defined, otherwise nothing is valid.
   */
  export interface IntrinsicElements {
    /** Allows all tags and properties. */
    [elementTag: string]: unknown;
  }
}

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
