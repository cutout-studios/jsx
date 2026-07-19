/** @jsxImportSource @cutout/jsx */

import { CutoutError, CutoutErrorCode } from "@cutout/internal";
import {
  CUTOUT_CHILDREN_LABEL,
  CUTOUT_TOKEN_TYPE_INDEX,
  CUTOUT_TOKEN_VALUE_INDEX,
  type CutoutAttributeToken,
  type CutoutElementToken,
  type CutoutIdentifierToken,
  type CutoutJSXToken,
  type CutoutOutputToken,
  type CutoutPrimitiveToken,
  CutoutTokenType,
  equals,
  isPromiseToken,
  tokenizeValue,
} from "@cutout/jsx/tokens";
import type { CutoutBackend, CutoutBackendPath } from "@cutout/store/backend";
import type {
  CutoutAttributeSelector,
  CutoutStoreSelector,
} from "@cutout/store/selector";

import {
  INDEX_ATTRIBUTES_TOKEN,
  INDEX_CHILDREN_TOKEN,
  INDEX_SNAPSHOTS_TOKEN,
  INDEX_TAGS_TOKEN,
  ROOT_SNAPSHOT_TOKEN,
} from "./constants.ts";
import { getIdentifierTokenFactory } from "./identifier.ts";
import { addAttributePath, addChildPath, addTagPath } from "./paths.ts";
import type { Store } from "./types.ts";

type Options = {
  backend: CutoutBackend;
};

export const create = ({ backend }: Options): Store => {
  const getSnapshotToken = getIdentifierTokenFactory();

  return {
    append(jsxGenerator: CutoutJSXToken) {
      const appendStack: CutoutIdentifierToken[] = [ROOT_SNAPSHOT_TOKEN];
      const childCounter = _createChildPositionCounter();
      childCounter.init(ROOT_SNAPSHOT_TOKEN);

      let attributePointer: CutoutAttributeToken | null = null;
      for (const token of jsxGenerator[CUTOUT_TOKEN_VALUE_INDEX]()) {
        const parent = appendStack.at(-1) ?? ROOT_SNAPSHOT_TOKEN;
        const childCount = childCounter.get(parent);

        switch (token[CUTOUT_TOKEN_TYPE_INDEX]) {
          case CutoutTokenType.ELEMENT_OPEN: {
            const snapshot = getSnapshotToken();

            addTagPath(backend, { snapshot, tag: token });
            addChildPath(backend, {
              child: snapshot,
              parent,
              childIndex: childCount,
            });

            childCounter.init(snapshot);
            appendStack.push(snapshot);

            childCounter.increment(parent);

            attributePointer = null;
            break;
          }
          case CutoutTokenType.ATTRIBUTE:
            if (token[CUTOUT_TOKEN_VALUE_INDEX] !== CUTOUT_CHILDREN_LABEL) {
              attributePointer = token;
            }
            break;
          case CutoutTokenType.ELEMENT_CLOSE:
            appendStack.pop();
            /* falls through */
          case CutoutTokenType.UNDEFINED:
            attributePointer = null;
            break;
          case CutoutTokenType.BOOLEAN:
          case CutoutTokenType.STRING:
          case CutoutTokenType.NUMBER:
          case CutoutTokenType.SYMBOL:
          case CutoutTokenType.ARRAY:
          case CutoutTokenType.OBJECT:
          case CutoutTokenType.NULL:
            if (attributePointer) {
              addAttributePath(
                backend,
                {
                  snapshot: parent,
                  attributeKey: attributePointer,
                  attributeValue: token,
                },
              );

              attributePointer = null;
              break;
            }

            addChildPath(backend, {
              parent,
              childIndex: childCount,
              child: token,
            });
            childCounter.increment(parent);
            break;
          case CutoutTokenType.PROMISE:
            throw new CutoutError(CutoutErrorCode.OPERATION_UNSUPPORTED);
          case CutoutTokenType.FUNCTION:
            throw new CutoutError(CutoutErrorCode.DATA_MALFORMED);
        }
      }
    },
    select(selectors: CutoutStoreSelector[]): CutoutJSXToken[] {
      _checkSelectorSupport(selectors);

      const snapshots = new Set<string>();
      for (const selector of selectors) {
        for (const snapshot of _selectSnapshotIdsFrom(backend, selector)) {
          snapshots.add(snapshot);
        }
      }

      const result: CutoutJSXToken[] = [];
      for (const snapshot of snapshots) {
        result.push(_createSelectorJSX(backend, snapshot));
      }

      return result;
    },
  };
};

// TODO: determine which of these live in a different file
function _createChildPositionCounter() {
  const record = {} as Record<string, number>;
  return {
    get([, snapshotId]: CutoutIdentifierToken) {
      return tokenizeValue(record[snapshotId]);
    },
    init([, snapshotId]: CutoutIdentifierToken) {
      record[snapshotId] ??= 0;
    },
    increment([, snapshotId]: CutoutIdentifierToken) {
      record[snapshotId]++;
    },
  };
}

// ISSUE(#100): properly resolve CSS combinators and attribute comparators
function _checkSelectorSupport(selectors: CutoutStoreSelector[]) {
  for (const { attributes, combinator, child } of selectors) {
    if (combinator || child) {
      throw new CutoutError(CutoutErrorCode.OPERATION_UNSUPPORTED);
    }

    for (const { operator, caseSensitive } of attributes) {
      if (operator || caseSensitive !== undefined) {
        throw new CutoutError(CutoutErrorCode.OPERATION_UNSUPPORTED);
      }
    }
  }
}

function _selectSnapshotIdsFrom(
  backend: CutoutBackend,
  { attributes, tag }: CutoutStoreSelector,
): Set<string> {
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

  return result ?? new Set();
}

const ATTRIBUTE_KEY_RANK_MAP: Record<string, number> = {
  id: 3,
  key: 2,
  class: 1,
  // *: 0
};

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
  const rankDifference = (ATTRIBUTE_KEY_RANK_MAP[rightKeyValue] ?? 0) -
    (ATTRIBUTE_KEY_RANK_MAP[leftKeyValue] ?? 0);
  if (rankDifference) return rankDifference;

  return (rightValue.length || rightKeyValue.length) -
    (leftValue.length || leftKeyValue.length);
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

type SelectionFrame = {
  snapshotId: string;
} | {
  token: CutoutOutputToken;
};

function _createSelectorJSX(
  backend: CutoutBackend,
  rootSnapshotId: string,
): CutoutJSXToken {
  return [
    CutoutTokenType.GENERATOR,
    function* () {
      let selectionStack: SelectionFrame[] = [
        { snapshotId: rootSnapshotId },
      ];
      while (selectionStack.length) {
        const frame = selectionStack.pop()!;

        if ("token" in frame) {
          yield frame.token;
          continue;
        }

        const snapshotPathGenerator = backend.list([INDEX_SNAPSHOTS_TOKEN, [
          CutoutTokenType.IDENTIFIER,
          frame.snapshotId,
        ]]);

        if (!snapshotPathGenerator) continue;

        let tagValue: string | undefined;
        const attributes: (CutoutAttributeToken | CutoutPrimitiveToken)[] = [];
        const orderedChildren: SelectionFrame[] = [];
        for (const path of snapshotPathGenerator) {
          if (isPromiseToken(path)) {
            throw new CutoutError(CutoutErrorCode.OPERATION_UNSUPPORTED);
          }

          const [indexToken, keyToken, valueToken] = path as CutoutBackendPath;

          // TODO: clean this section up
          if (equals(indexToken, INDEX_TAGS_TOKEN)) {
            yield keyToken as CutoutElementToken;
            [, tagValue] = keyToken as CutoutElementToken;
          }

          if (equals(indexToken, INDEX_ATTRIBUTES_TOKEN)) {
            attributes.push(
              keyToken as CutoutAttributeToken,
              valueToken as CutoutPrimitiveToken,
            );
          }

          if (
            equals(indexToken, INDEX_CHILDREN_TOKEN)
          ) {
            orderedChildren[keyToken[CUTOUT_TOKEN_VALUE_INDEX] as number] =
              valueToken[CUTOUT_TOKEN_TYPE_INDEX] === CutoutTokenType.IDENTIFIER
                ? {
                  snapshotId: valueToken[CUTOUT_TOKEN_VALUE_INDEX] as string,
                }
                : {
                  token: valueToken as CutoutOutputToken,
                };
          }
        }

        yield* attributes;

        if (orderedChildren.length) {
          yield [CutoutTokenType.ATTRIBUTE, CUTOUT_CHILDREN_LABEL];
        }

        selectionStack = [...selectionStack, {
          token: [CutoutTokenType.ELEMENT_CLOSE, tagValue!],
        }, ...(orderedChildren.reverse())];
      }
    },
  ];
}
