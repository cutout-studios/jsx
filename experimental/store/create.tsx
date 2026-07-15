/** @jsxImportSource @cutout/jsx */

import {
  CUTOUT_TOKEN_TYPE_INDEX,
  CUTOUT_TOKEN_VALUE_INDEX,
  CutoutAttributeToken,
  CutoutElementToken,
  type CutoutJSXToken,
  CutoutStringToken,
  CutoutTokenType,
} from "@cutout/jsx/tokens";
import type { CutoutBackend, CutoutBackendPath } from "@cutout/store/backend";
import type { CutoutStoreSelector } from "@cutout/store/selector";
import { getSnapshotIdFactory } from "./getSnapshotIdFactory.ts";
import { CutoutError, CutoutErrorCode } from "@cutout/internal";

type Options = {
  backend: CutoutBackend;
};

type Store = {
  append(jsx: CutoutJSXToken, options?: SelectionOptions): void;
  query(options?: SelectionOptions): CutoutJSXToken;
};

type SelectionOptions = {
  selector: CutoutStoreSelector;
  limit?: number;
};

const INDEX_SNAPSHOTS_TOKEN: CutoutStringToken = [
  CutoutTokenType.STRING,
  "snapshots",
];
const INDEX_TAGS_TOKEN: CutoutStringToken = [CutoutTokenType.STRING, "tags"];
const INDEX_ATTRIBUTES_TOKEN: CutoutStringToken = [
  CutoutTokenType.STRING,
  "attributes",
];
const INDEX_CHILDREN_TOKEN: CutoutStringToken = [CutoutTokenType.STRING, "children"];

export const create = ({ backend }: Options): Store => {
  const getSnapshotId = getSnapshotIdFactory();

  return {
    append(jsx: CutoutJSXToken) {
      const paths: CutoutBackendPath[] = [];

      const snapshotStack: [CutoutElementToken, number][] = [];
      let [currentSnapshotToken, currentAttributeToken] = [null, null] as [
        CutoutElementToken | null,
        CutoutAttributeToken | null,
      ];
      for (const token of jsx[CUTOUT_TOKEN_VALUE_INDEX]()) {
        switch (token[CUTOUT_TOKEN_TYPE_INDEX]) {
          case CutoutTokenType.ELEMENT_OPEN:
            if (currentSnapshotToken) {
              paths.push([
                INDEX_SNAPSHOTS_TOKEN,
                currentSnapshotToken,
                INDEX_CHILDREN_TOKEN,
                token
              ])
              snapshotStack.push([currentSnapshotToken, 0]);
            }
            currentSnapshotToken = [CutoutTokenType.STRING, getSnapshotId()];
            paths.push([
              INDEX_SNAPSHOTS_TOKEN,
              currentSnapshotToken,
              INDEX_TAGS_TOKEN,
              token,
            ]);
            paths.push([INDEX_TAGS_TOKEN, token, INDEX_SNAPSHOTS_TOKEN]);
            break;
          case CutoutTokenType.ELEMENT_CLOSE:
            currentSnapshotToken = null;
            currentAttributeToken = null;
            snapshotStack.pop();
            if (snapshotStack.at(-1)) {
              snapshotStack.at(-1)[1]++;
            }
            break;
          case CutoutTokenType.ATTRIBUTE:
            currentAttributeToken = token;
            break;
          case CutoutTokenType.BOOLEAN:
          case CutoutTokenType.STRING:
          case CutoutTokenType.NUMBER:
          case CutoutTokenType.SYMBOL:
          case CutoutTokenType.NULL:
            if (!currentAttributeToken) {
              throw new CutoutError();
            }

            paths.push([
              INDEX_SNAPSHOTS_TOKEN,
              currentSnapshotToken,
              INDEX_ATTRIBUTES_TOKEN,
              currentAttributeToken,
              token,
            ]);
            paths.push([
              INDEX_ATTRIBUTES_TOKEN,
              currentAttributeToken,
              token,
              currentSnapshotToken,
            ]);

            currentAttributeToken = null;
            break;
          case CutoutTokenType.ARRAY:
          case CutoutTokenType.OBJECT:
            // TODO: expand
          case CutoutTokenType.UNDEFINED:
            if (currentAttributeToken) {
              currentAttributeToken = null;
            }
            continue;
          case CutoutTokenType.PROMISE:
            throw new CutoutError(CutoutErrorCode.OPERATION_UNSUPPORTED);
          case CutoutTokenType.FUNCTION:
            throw new CutoutError(CutoutErrorCode.DATA_MALFORMED);
        }
      }

      for (const path of paths) {
        backend.add(path);
      }
    },

    query(): CutoutJSXToken {
      // TODO: using attributes/tags, load node ids
      // TODO: convert first path back to jsx
      return <></>;
    },
  };
};
