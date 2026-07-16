import { CutoutError, CutoutErrorCode } from "@cutout/internal";
import {
  type CutoutAttributeToken,
  type CutoutElementToken,
  type CutoutIdentifierToken,
  type CutoutOutputToken,
  isPrimitiveToken,
} from "@cutout/jsx/tokens";
import type { CutoutBackend } from "@cutout/store/backend";

import {
  INDEX_ATTRIBUTES_TOKEN,
  INDEX_SNAPSHOTS_TOKEN,
  INDEX_TAGS_TOKEN,
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
      attributeValue, // TODO: stringify, to match selector
      snapshot,
    ]);
    return;
  }

  // TODO: else, expand paths
  throw new CutoutError(CutoutErrorCode.OPERATION_UNSUPPORTED);
}

export function addChildPath(backend: CutoutBackend, {}) {
  // TODO
}
