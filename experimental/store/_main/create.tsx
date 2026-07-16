/** @jsxImportSource @cutout/jsx */

import { CutoutError, CutoutErrorCode } from "@cutout/internal";
import {
  CUTOUT_TOKEN_TYPE_INDEX,
  CUTOUT_TOKEN_VALUE_INDEX,
  type CutoutAttributeToken,
  type CutoutIdentifierToken,
  type CutoutJSXToken,
  type CutoutNumberToken,
  CutoutTokenType,
  tokenizeValue,
} from "@cutout/jsx/tokens";
import type { CutoutBackend } from "@cutout/store/backend";

import { ROOT_SNAPSHOT_TOKEN } from "./constants.ts";
import { getIdentifierTokenFactory } from "./identifier.ts";
import { addAttributePath, addChildPath, addTagPath } from "./paths.ts";
import type { Store } from "./types.ts";

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

            parentTracker[TRACKER_RANK_INDEX][CUTOUT_TOKEN_VALUE_INDEX]++;

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
            break;
          case CutoutTokenType.PROMISE:
            throw new CutoutError(CutoutErrorCode.OPERATION_UNSUPPORTED);
          case CutoutTokenType.FUNCTION:
            throw new CutoutError(CutoutErrorCode.DATA_MALFORMED);
        }
      }
    },
    // TODO
    select() {
      return <span></span>;
    },
  };
};
