/** @jsxImportSource @cutout/jsx */

import { CutoutError, CutoutErrorCode } from "@cutout/internal";
import {
  CUTOUT_TOKEN_TYPE_INDEX,
  CUTOUT_TOKEN_VALUE_INDEX,
  type CutoutAttributeToken,
  type CutoutIdentifierToken,
  type CutoutJSXToken,
  CutoutTokenType,
} from "@cutout/jsx/tokens";
import type { CutoutBackend } from "@cutout/store/backend";

import { getIdentifierTokenFactory } from "./identifier.ts";
import { addAttributePath, addChildPath, addTagPath } from "./paths.ts";
import type { Store } from "./types.ts";

type Options = {
  backend: CutoutBackend;
};

export const create = ({ backend }: Options): Store => {
  const getSnapshotToken = getIdentifierTokenFactory();

  return {
    append(jsx: CutoutJSXToken) {
      // TODO: handle children
      const snapshotStack: [CutoutIdentifierToken, number][] = [];
      let attributePointer: CutoutAttributeToken | null = null;
      for (const token of jsx[CUTOUT_TOKEN_VALUE_INDEX]()) {
        const parent = snapshotStack.at(-1);
        switch (token[CUTOUT_TOKEN_TYPE_INDEX]) {
          case CutoutTokenType.ELEMENT_OPEN: {
            const snapshot = getSnapshotToken();

            addTagPath(backend, { snapshot, tag: token });
            addChildPath(backend, { snapshot, parent /* TODO */ });

            snapshotStack.push([snapshot, 0]);
            attributePointer = null;
            break;
          }
          case CutoutTokenType.ATTRIBUTE:
            attributePointer = token;
            break;
          case CutoutTokenType.ELEMENT_CLOSE:
            snapshotStack.pop();
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
            if (!parent) {
              throw new CutoutError(CutoutErrorCode.DATA_MALFORMED);
            }

            if (attributePointer) {
              addAttributePath(
                backend,
                {
                  snapshot: parent[0],
                  attributeKey: attributePointer,
                  attributeValue: token,
                },
              );
              attributePointer = null;
              break;
            }

            addChildPath(backend, {/* TODO */});
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
