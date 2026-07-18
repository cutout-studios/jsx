/** @jsxImportSource @cutout/jsx */

import { CutoutError, CutoutErrorCode } from "@cutout/internal";
import {
  CUTOUT_CHILDREN_LABEL,
  CUTOUT_TOKEN_TYPE_INDEX,
  CUTOUT_TOKEN_VALUE_INDEX,
  type CutoutAttributeToken,
  type CutoutElementCloseToken,
  type CutoutElementToken,
  type CutoutIdentifierToken,
  type CutoutJSXToken,
  type CutoutNumberToken,
  type CutoutPrimitiveToken,
  CutoutTokenType,
  equals,
  isValidToken,
  tokenizeValue,
} from "@cutout/jsx/tokens";
import type { CutoutBackend, CutoutBackendPath } from "@cutout/store/backend";
import type { CutoutStoreSelector } from "@cutout/store/selector";

import {
  INDEX_ATTRIBUTES_TOKEN,
  INDEX_CHILDREN_TOKEN,
  INDEX_SNAPSHOTS_TOKEN,
  INDEX_TAGS_TOKEN,
  ROOT_SNAPSHOT_TOKEN,
} from "./constants.ts";
import { getIdentifierTokenFactory } from "./identifier.ts";
import { addAttributePath, addChildPath, addTagPath } from "./paths.ts";
import type { SelectionOptions, Store } from "./types.ts";

type Options = {
  backend: CutoutBackend;
};

type SnapshotTracker = [CutoutIdentifierToken, CutoutNumberToken];

const TRACKER_SNAPSHOT_INDEX = 0;
const TRACKER_RANK_INDEX = 1;

const makeTracker = (
  snapshot: CutoutIdentifierToken,
): SnapshotTracker => [snapshot, tokenizeValue(0) as CutoutNumberToken];

export const create = ({ backend }: Options): Store => {
  const getSnapshotToken = getIdentifierTokenFactory();

  return {
    append(jsx: CutoutJSXToken) {
      let attributePointer: CutoutAttributeToken | null = null;
      const rootTracker = makeTracker(ROOT_SNAPSHOT_TOKEN);
      const trackerStack: SnapshotTracker[] = [];
      for (const token of jsx[CUTOUT_TOKEN_VALUE_INDEX]()) {
        const parentTracker = trackerStack.at(-1) ?? rootTracker;
        switch (token[CUTOUT_TOKEN_TYPE_INDEX]) {
          case CutoutTokenType.ELEMENT_OPEN: {
            const snapshot = getSnapshotToken();

            addTagPath(backend, { snapshot, tag: token });
            addChildPath(backend, {
              child: snapshot,
              parent: parentTracker[TRACKER_SNAPSHOT_INDEX],
              rank: parentTracker[TRACKER_RANK_INDEX],
            });

            parentTracker[TRACKER_RANK_INDEX] = [
              parentTracker[TRACKER_RANK_INDEX][CUTOUT_TOKEN_TYPE_INDEX],
              parentTracker[TRACKER_RANK_INDEX][CUTOUT_TOKEN_VALUE_INDEX] + 1,
            ];

            trackerStack.push(makeTracker(snapshot));
            attributePointer = null;
            break;
          }
          case CutoutTokenType.ATTRIBUTE:
            attributePointer = token;
            break;
          case CutoutTokenType.ELEMENT_CLOSE:
            trackerStack.pop();
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
            if (!parentTracker) {
              throw new CutoutError(CutoutErrorCode.DATA_MALFORMED);
            }

            if (attributePointer) {
              addAttributePath(
                backend,
                {
                  snapshot: parentTracker[0],
                  attributeKey: attributePointer,
                  attributeValue: token,
                },
              );
              attributePointer = null;
              break;
            }

            addChildPath(backend, {
              parent: parentTracker[TRACKER_SNAPSHOT_INDEX],
              rank: parentTracker[TRACKER_RANK_INDEX],
              child: token,
            });

            parentTracker[TRACKER_RANK_INDEX] = [
              parentTracker[TRACKER_RANK_INDEX][CUTOUT_TOKEN_TYPE_INDEX],
              parentTracker[TRACKER_RANK_INDEX][CUTOUT_TOKEN_VALUE_INDEX] + 1,
            ];
            break;
          case CutoutTokenType.PROMISE:
            throw new CutoutError(CutoutErrorCode.OPERATION_UNSUPPORTED);
          case CutoutTokenType.FUNCTION:
            throw new CutoutError(CutoutErrorCode.DATA_MALFORMED);
        }
      }
    },
    select(
      selectors: CutoutStoreSelector[],
      { limit = 1 }: SelectionOptions,
    ): CutoutJSXToken[] {
      const [encoder, decoder] = [new TextEncoder(), new TextDecoder()];
      const resultSet = new Set<string>();
      for (const selector of selectors) {
        let selectorSet;
        if (selector.combinator || selector.child) {
          throw new CutoutError(CutoutErrorCode.OPERATION_UNSUPPORTED);
        }

        // TODO: order from most to least specific
        if (selector.attributes) {
          for (
            const { value, operator, caseSensitive } of selector.attributes
          ) {
            // ISSUE(#100): properly resolve CSS combinators and attribute comparators
            if (operator || caseSensitive !== undefined) {
              throw new CutoutError(CutoutErrorCode.OPERATION_UNSUPPORTED);
            }

            const attibuteSet = new Set<string>();
            for (
              const path of backend.list([INDEX_ATTRIBUTES_TOKEN, value!]) ??
                []
            ) {
              const [, snapshotId] = path.at(
                -1,
              ) as CutoutIdentifierToken;

              attibuteSet.add(decoder.decode(snapshotId));
            }

            // TODO: 'has' instead of intersect?
            selectorSet = selectorSet
              ? intersect(selectorSet, attibuteSet)
              : attibuteSet;
          }
        }

        if (selector.tag) {
          const tagSet = new Set<string>();
          for (
            const path of backend.list([INDEX_TAGS_TOKEN, selector.tag]) ?? []
          ) {
            const [, snapshotId] = path.at(-1) as CutoutIdentifierToken;

            tagSet.add(decoder.decode(snapshotId));
          }
          selectorSet = selectorSet ? intersect(selectorSet, tagSet) : tagSet;
        }

        if (selectorSet) {
          for (const element of selectorSet) {
            resultSet.add(element);
          }
        }
      }

      return Array.from(resultSet).slice(limit * -1).map((rootSnapshotId) => {
        return [
          CutoutTokenType.GENERATOR,
          function* () {
            let childStack: { id?: string; close?: CutoutElementCloseToken }[] =
              [
                { id: rootSnapshotId },
              ];
            while (childStack.length) {
              const { id, close } = childStack.pop()!;

              if (close) {
                yield close;
                continue;
              }

              const snapshotGenerator = backend.list([INDEX_SNAPSHOTS_TOKEN, [
                CutoutTokenType.IDENTIFIER,
                encoder.encode(id),
              ]]);

              if (!snapshotGenerator) {
                continue;
              }

              let tagValue: string | undefined;
              const attributes:
                (CutoutAttributeToken | CutoutPrimitiveToken)[] = [];
              const children = [];
              for (const path of snapshotGenerator) {
                if (isValidToken(path)) {
                  yield path; // Promise
                  break;
                }

                const [indexToken, keyToken, valueToken] =
                  path as CutoutBackendPath;

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
                  children[valueToken[CUTOUT_TOKEN_VALUE_INDEX] as number] = {
                    id: decoder
                      .decode(keyToken[CUTOUT_TOKEN_VALUE_INDEX] as Uint8Array),
                  };
                }
              }

              yield* attributes;

              if (children.length) {
                yield [CutoutTokenType.ATTRIBUTE, CUTOUT_CHILDREN_LABEL];
              }

              childStack = [...childStack, {
                close: [CutoutTokenType.ELEMENT_CLOSE, tagValue!],
              }, ...(children.reverse())];
            }
          },
        ];
      });
    },
  };
};

function intersect<T>(left: Set<T>, right: Set<T>): Set<T> {
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
