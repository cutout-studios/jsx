import { CutoutError, CutoutErrorCode } from "@cutout/internal";
import {
  CUTOUT_TOKEN_TYPE_INDEX,
  CUTOUT_TOKEN_VALUE_INDEX,
  type CutoutAttributeToken,
  type CutoutElementToken,
  type CutoutIdentifierToken,
  type CutoutNumberToken,
  type CutoutOutputToken,
  type CutoutStringToken,
  CutoutTokenType,
  isPrimitiveToken,
  tokenizeValue,
} from "@cutout/jsx/tokens";
import type { CutoutBackend } from "@cutout/store/backend";

import {
  INDEX_ATTRIBUTES_TOKEN,
  INDEX_CHILDREN_TOKEN,
  INDEX_PARENT_TOKEN,
  INDEX_SNAPSHOTS_TOKEN,
  INDEX_TAGS_TOKEN,
  ROOT_SNAPSHOT_TOKEN,
} from "./constants.ts";

export function addTagPath(
  backend: CutoutBackend,
  { snapshot, tag }: {
    snapshot: CutoutIdentifierToken;
    tag: CutoutElementToken;
  },
): void {
  backend.add([
    INDEX_SNAPSHOTS_TOKEN,
    snapshot,
    INDEX_TAGS_TOKEN,
    tag,
  ]);
  backend.add([INDEX_TAGS_TOKEN, tag, snapshot]);
}

export function addAttributePath(
  backend: CutoutBackend,
  { snapshot, attributeKey, attributeValue }: {
    snapshot: CutoutIdentifierToken;
    attributeKey: CutoutAttributeToken;
    attributeValue: CutoutOutputToken;
  },
): void {
  if (isPrimitiveToken(attributeValue)) {
    backend.add([
      INDEX_SNAPSHOTS_TOKEN,
      snapshot,
      INDEX_ATTRIBUTES_TOKEN,
      attributeKey,
      attributeValue,
    ]);

    backend.add([
      INDEX_ATTRIBUTES_TOKEN,
      attributeKey,
      // Attribute values must be stringified in the reverse lookup so we can properly match them
      // with the Store Selector.
      tokenizeValue(
        String(attributeValue[CUTOUT_TOKEN_VALUE_INDEX]),
      ) as CutoutStringToken,
      snapshot,
    ]);

    return;
  }

  // ISSUE(#99): Unwrap raw arrays/objects into backend paths.
  throw new CutoutError(CutoutErrorCode.OPERATION_UNSUPPORTED);
}

export function addChildPath(
  backend: CutoutBackend,
  { parent = ROOT_SNAPSHOT_TOKEN, child, childIndex }: {
    parent?: CutoutIdentifierToken;
    child: CutoutIdentifierToken | CutoutOutputToken;
    childIndex: CutoutNumberToken;
  },
) {
  if (child[CUTOUT_TOKEN_TYPE_INDEX] === CutoutTokenType.IDENTIFIER) {
    backend.add([
      INDEX_SNAPSHOTS_TOKEN,
      parent,
      INDEX_CHILDREN_TOKEN,
      childIndex,
      child,
    ]);

    backend.add([
      INDEX_SNAPSHOTS_TOKEN,
      child,
      INDEX_PARENT_TOKEN,
      parent,
      childIndex,
    ]);

    return;
  }

  if (isPrimitiveToken(child)) {
    backend.add([
      INDEX_SNAPSHOTS_TOKEN,
      parent,
      INDEX_CHILDREN_TOKEN,
      childIndex,
      child,
    ]);

    return;
  }

  // ISSUE(#99): Unwrap raw arrays/objects into backend paths
  throw new CutoutError(CutoutErrorCode.OPERATION_UNSUPPORTED);
}
