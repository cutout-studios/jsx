import { CutoutError, CutoutErrorCode } from "@cutout/internal";
import {
  CUTOUT_CHILDREN_LABEL,
  CUTOUT_TOKEN_VALUE_INDEX,
  type CutoutAttributeToken,
  type CutoutElementToken,
  type CutoutIdentifierToken,
  type CutoutJSXToken,
  type CutoutNumberToken,
  type CutoutOutputToken,
  type CutoutPrimitiveToken,
  CutoutTokenType,
  isPromiseToken,
  tokenizeValue,
} from "@cutout/jsx/tokens";
import type { CutoutBackend, CutoutBackendPath } from "@cutout/store/backend";
import type {
  CutoutAttributeSelector,
  CutoutStoreSelector,
} from "@cutout/store/selector";

import {
  INDEX_ATTRIBUTES_LABEL,
  INDEX_ATTRIBUTES_TOKEN,
  INDEX_SNAPSHOTS_TOKEN,
  INDEX_TAGS_LABEL,
  INDEX_TAGS_TOKEN,
  SELECTION_ATTRIBUTE_KEY_RANK_MAP,
} from "./constants.ts";

type SelectionFrame = {
  isSnapshot: true;
  token: CutoutIdentifierToken;
} | {
  isSnapshot: false;
  token: CutoutOutputToken;
};

export function selectJSX(
  backend: CutoutBackend,
  snapshot: CutoutIdentifierToken,
): CutoutJSXToken {
  return [
    CutoutTokenType.GENERATOR,
    function* () {
      let selectionStack: SelectionFrame[] = [
        { token: snapshot, isSnapshot: true },
      ];
      while (selectionStack.length) {
        const frame = selectionStack.pop()!;

        if (!frame.isSnapshot) {
          yield frame.token;
          continue;
        }

        const snapshotPathGenerator = backend.list([
          INDEX_SNAPSHOTS_TOKEN,
          frame.token,
        ]);

        if (!snapshotPathGenerator) continue;

        let tagValue: string | undefined;
        const attributes: (CutoutAttributeToken | CutoutPrimitiveToken)[] = [];
        const orderedChildren: SelectionFrame[] = [];
        for (const path of snapshotPathGenerator) {
          if (isPromiseToken(path)) {
            throw new CutoutError(CutoutErrorCode.OPERATION_UNSUPPORTED);
          }

          const [indexNameToken, keyToken, valueToken] =
            path as CutoutBackendPath;

          switch (indexNameToken[CUTOUT_TOKEN_VALUE_INDEX]) {
            case INDEX_TAGS_LABEL: {
              yield keyToken as CutoutElementToken;
              [, tagValue] = keyToken as CutoutElementToken;
              break;
            }
            case INDEX_ATTRIBUTES_LABEL:
              attributes.push(
                keyToken as CutoutAttributeToken,
                valueToken as CutoutPrimitiveToken,
              );
              break;
            case CUTOUT_CHILDREN_LABEL: {
              const [, childIndex] = keyToken as CutoutNumberToken;
              const [childType] = valueToken;

              orderedChildren[childIndex] =
                childType === CutoutTokenType.IDENTIFIER
                  ? {
                    isSnapshot: true,
                    token: valueToken as CutoutIdentifierToken,
                  }
                  : {
                    isSnapshot: false,
                    token: valueToken as CutoutPrimitiveToken,
                  };
            }
          }
        }

        yield* attributes;

        if (orderedChildren.length) {
          yield [CutoutTokenType.ATTRIBUTE, CUTOUT_CHILDREN_LABEL];
        }

        selectionStack = [...selectionStack, {
          isSnapshot: false,
          token: [CutoutTokenType.ELEMENT_CLOSE, tagValue!],
        }, ...(orderedChildren.reverse())];
      }
    },
  ];
}

export function selectTokens(
  backend: CutoutBackend,
  { attributes, tag }: CutoutStoreSelector,
): CutoutIdentifierToken[] {
  let result;

  if (attributes) {
    for (
      const { value, key } of [...attributes].sort(_attributeSpecifityHeuristic)
    ) {
      const attibuteSet = new Set<string>();
      const prefix = value ? [key, value] : [key];
      for (
        const path of backend.list([INDEX_ATTRIBUTES_TOKEN, ...prefix]) ??
          []
      ) {
        if (isPromiseToken(path)) {
          throw new CutoutError(CutoutErrorCode.OPERATION_UNSUPPORTED);
        }

        const [, snapshotId] = path.at(-1) as CutoutIdentifierToken;

        attibuteSet.add(snapshotId);
      }

      result = result ? _intersect(result, attibuteSet) : attibuteSet;
    }
  }

  if (tag) {
    const tagSet = new Set<string>();
    for (
      const path of backend.list([INDEX_TAGS_TOKEN, tag]) ?? []
    ) {
      if (isPromiseToken(path)) {
        throw new CutoutError(CutoutErrorCode.OPERATION_UNSUPPORTED);
      }

      const [, snapshotId] = path.at(-1) as CutoutIdentifierToken;

      tagSet.add(snapshotId);
    }
    result = result ? _intersect(result, tagSet) : tagSet;
  }

  return Array.from(result ?? new Set<string>()).map(
    (id) => [CutoutTokenType.IDENTIFIER, id],
  );
}

function _intersect<T>(left: Set<T>, right: Set<T>): Set<T> {
  const result = new Set<T>();

  const [smallerSet, largerSet] = left.size < right.size
    ? [left, right]
    : [right, left];
  for (const item of smallerSet) {
    if (largerSet.has(item)) {
      result.add(item);
    }
  }

  return result;
}

function _attributeSpecifityHeuristic(
  {
    key: [, leftKeyValue],
    value: [, leftValue] = tokenizeValue(""),
  }: CutoutAttributeSelector,
  {
    key: [, rightKeyValue],
    value: [, rightValue] = tokenizeValue(""),
  }: CutoutAttributeSelector,
): number {
  const rankDifference =
    (SELECTION_ATTRIBUTE_KEY_RANK_MAP[rightKeyValue] ?? 0) -
    (SELECTION_ATTRIBUTE_KEY_RANK_MAP[leftKeyValue] ?? 0);
  if (rankDifference) return rankDifference;

  return (rightValue.length || rightKeyValue.length) -
    (leftValue.length || leftKeyValue.length);
}
