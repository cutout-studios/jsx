import {
  type CutoutElementToken,
  type CutoutGeneratorToken,
  type CutoutPropertyToken,
  type CutoutChildStartToken,
  type CutoutChildEndToken,
  CutoutTypeAnnotation,
  isValidCutoutToken,
  TOKEN_ANNOTATION_INDEX,
  TOKEN_VALUE_INDEX,
  tokenizeValue,
} from "@cutout/jsx/model";

declare global {
  namespace JSX {
    // Interpreters decide which nodes are valid.
    interface IntrinsicElements {
      [elementTag: string]: Record<string, unknown>;
    }
  }
}

export const Fragment = [CutoutTypeAnnotation.FRAGMENT, null];

export const jsx = (
  type: string,
  props: { [key: string]: unknown },
  ...children: unknown[]
): CutoutGeneratorToken => {
  const _generator = function* () {
    yield [CutoutTypeAnnotation.ELEMENT, type] as CutoutElementToken;

    for (const key in props) {
      yield [CutoutTypeAnnotation.PROPERTY, key] as CutoutPropertyToken;

      for (const token of _forwardTokens(props[key])) yield token;
    }
    
    for (const child of children) {
      yield [CutoutTypeAnnotation.CHILD_START, null] as CutoutChildStartToken;

      for (const token of _forwardTokens(child)) yield token;

      yield [CutoutTypeAnnotation.CHILD_END, null] as CutoutChildEndToken;
    }
  };

  return [CutoutTypeAnnotation.GENERATOR, _generator()];
};

// Just pass these through for now
export const jsxs = jsx;
export const jsxDEV = jsx;

function* _forwardTokens(value: unknown, debug = false) {
  const isValidToken = isValidCutoutToken(value);

  if (
    isValidCutoutToken(value) &&
    value[TOKEN_ANNOTATION_INDEX] === CutoutTypeAnnotation.GENERATOR
  ) {
    for (const generatorToken of value[TOKEN_VALUE_INDEX]) {
      yield generatorToken;
    }
    return;
  }

  if (isValidToken) {
    yield value;
    return;
  }

  const token = tokenizeValue(value);

  if (token[TOKEN_ANNOTATION_INDEX] === CutoutTypeAnnotation.UNKNOWN) {
    if (debug) {
      let unknownValue;

      try {
        unknownValue = JSON.stringify(value);
      } catch {
        unknownValue = "[UNSERIALIZABLE]";
      }

      console.warn(`Encountered unknown value ${unknownValue}. Skipping.`);
    }
    return;
  }

  yield token;
  return;
}

