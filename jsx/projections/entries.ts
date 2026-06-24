import {
  CUTOUT_CHILDREN_LABEL,
  type CutoutOutputToken,
  type CutoutPrimitiveToken,
  type CutoutSyntaxToken,
  CutoutTokenType,
} from "@cutout/jsx/tokens";

import type { Projection } from "./types.ts";

const DEFAULT_EXTRACTION_KEYS: CutoutSyntaxToken[] = [
  [CutoutTokenType.ATTRIBUTE, "key"],
  [CutoutTokenType.ATTRIBUTE, "id"],
  [CutoutTokenType.ATTRIBUTE, "name"],
];

const DEFAULT_EXTRACTION_VALUES: CutoutSyntaxToken[] = [
  [CutoutTokenType.ATTRIBUTE, CUTOUT_CHILDREN_LABEL],
  [CutoutTokenType.ATTRIBUTE, "value"],
];

export const entries: Projection<_Output, _Options> = (
  [, generator],
  {
    extract: {
      keys = DEFAULT_EXTRACTION_KEYS,
      values = DEFAULT_EXTRACTION_VALUES,
    },
  } = {},
) => {
  const result: _Output = [];

  const keyAttributeSet = keys.filter(([type]) =>
    type === CutoutTokenType.ATTRIBUTE
  ).reduce(
    (set, [, attributeName]) => set.add(attributeName),
    new Set<string>(),
  );

  const valueAttributeSet = values.filter(([type]) =>
    type === CutoutTokenType.ATTRIBUTE
  ).reduce(
    (set, [, attributeName]) => set.add(attributeName),
    new Set<string>(),
  );

  const stack = [];
  let isKeyAttribute = false;
  let isValueAttribute = false;
  for (const [type, value] of generator()) {
    switch (type) {
      case CutoutTokenType.ELEMENT_OPEN:
        // If matches an open extraction point, prime to extract the next child.
        // Push the stack.
        break;
      case CutoutTokenType.ELEMENT_CLOSE:
        // Element close is a nonsensical extraction point, we should forbid it.
        // Pop the stack.
        break;
      case CutoutTokenType.ATTRIBUTE:
        isKeyAttribute = keyAttributeSet.has(value);
        isValueAttribute = valueAttributeSet.has(value);
        break;
      case CutoutTokenType.UNDEFINED:
      case CutoutTokenType.NULL:
      case CutoutTokenType.BOOLEAN:
      case CutoutTokenType.STRING:
      case CutoutTokenType.NUMBER:
      case CutoutTokenType.SYMBOL:
      case CutoutTokenType.ARRAY:
      case CutoutTokenType.OBJECT:
      case CutoutTokenType.FUNCTION:
        if (isKeyAttribute) {
          // Yell if not primitive
          // ...
        }

        if (isValueAttribute) {
          // push value to matching path - we collect all values of the same path.
        }

        isKeyAttribute = false;
        isValueAttribute = false;
        break;
    }
  }

  return result;
};

type _Output = Array<[key: CutoutPrimitiveToken[], value: CutoutOutputToken[]]>;
type _Options = {
  extract?: {
    keys?: CutoutSyntaxToken[];
    values?: CutoutSyntaxToken[];
  };
};
