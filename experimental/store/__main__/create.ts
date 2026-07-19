/** @jsxImportSource @cutout/jsx */

import { CutoutError, CutoutErrorCode } from "@cutout/internal";
import {
  CUTOUT_CHILDREN_LABEL,
  CUTOUT_TOKEN_TYPE_INDEX,
  CUTOUT_TOKEN_VALUE_INDEX,
  type CutoutAttributeToken,
  type CutoutIdentifierToken,
  type CutoutJSXToken,
  CutoutTokenType,
  isPrimitiveToken,
  tokenizeValue,
} from "@cutout/jsx/tokens";
import type { CutoutBackend } from "@cutout/store/backend";
import type { CutoutStoreSelector } from "@cutout/store/selector";

import { ROOT_SNAPSHOT_TOKEN } from "./constants.ts";
import { appendAttribute, appendChild, appendTag } from "./snapshots.append.ts";
import { getIdentifierTokenFactory } from "./snapshots.identifier.ts";
import { selectJSX, selectTokens } from "./snapshots.select.ts";
import type { Store } from "./types.ts";

type Options = {
  backend: CutoutBackend;
};

export const create = ({ backend }: Options): Store => {
  const getSnapshotToken = getIdentifierTokenFactory();

  return {
    append(jsxGenerator: CutoutJSXToken) {
      const appendStack: CutoutIdentifierToken[] = [ROOT_SNAPSHOT_TOKEN];
      const childCounter = _createChildIndexCounter();
      childCounter.init(ROOT_SNAPSHOT_TOKEN);

      let attributePointer: CutoutAttributeToken | null = null;
      for (const token of jsxGenerator[CUTOUT_TOKEN_VALUE_INDEX]()) {
        const parent = appendStack.at(-1) ?? ROOT_SNAPSHOT_TOKEN;
        const childCount = childCounter.get(parent);

        switch (token[CUTOUT_TOKEN_TYPE_INDEX]) {
          case CutoutTokenType.ELEMENT_OPEN: {
            const snapshot = getSnapshotToken();

            appendTag(backend, { snapshot, tag: token });
            appendChild(backend, {
              snapshot: parent,
              child: { token: snapshot, index: childCount },
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
              appendAttribute(
                backend,
                {
                  snapshot: parent,
                  attribute: { key: attributePointer, value: token },
                },
              );

              attributePointer = null;
              break;
            }

            if (!isPrimitiveToken(token)) {
              throw new CutoutError(CutoutErrorCode.OPERATION_UNSUPPORTED);
            }

            appendChild(backend, {
              snapshot: parent,
              child: { token, index: childCount },
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

      const snapshotIds = new Set<string>();
      for (const selector of selectors) {
        for (const snapshot of selectTokens(backend, selector)) {
          snapshotIds.add(snapshot[CUTOUT_TOKEN_VALUE_INDEX]);
        }
      }

      const result: CutoutJSXToken[] = [];
      for (const snapshotId of snapshotIds) {
        result.push(
          selectJSX(backend, [CutoutTokenType.IDENTIFIER, snapshotId]),
        );
      }

      return result;
    },
  };
};

function _createChildIndexCounter() {
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
