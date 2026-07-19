import { CutoutError, CutoutErrorCode } from "@cutout/internal";
import {
  CUTOUT_TOKEN_TYPE_INDEX,
  CUTOUT_TOKEN_VALUE_INDEX,
  type CutoutAttributeToken,
  type CutoutElementToken,
  type CutoutIdentifierToken,
  type CutoutNumberToken,
  type CutoutOutputToken,
  type CutoutPrimitiveToken,
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

export function appendTag(
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

export function appendAttribute(
  backend: CutoutBackend,
  { snapshot, attribute: { key, value } }: {
    snapshot: CutoutIdentifierToken;
    attribute: { key: CutoutAttributeToken; value: CutoutOutputToken };
  },
): void {
  // ISSUE(#99): Unwrap raw arrays/objects into backend paths.
  if (!isPrimitiveToken(value)) {
    throw new CutoutError(CutoutErrorCode.OPERATION_UNSUPPORTED);
  }

  backend.add([
    INDEX_SNAPSHOTS_TOKEN,
    snapshot,
    INDEX_ATTRIBUTES_TOKEN,
    key,
    value,
  ]);

  // The attribute reverse lookup table require further processing
  // so the system can match them:

  // => The Store Selector is string-based, so too should the value be so we can match.
  let reverseLookupStrings = [String(value[CUTOUT_TOKEN_VALUE_INDEX])];

  // => The class list is an implicit array; we must add each class separately.
  if (
    key[CUTOUT_TOKEN_VALUE_INDEX] === "class" &&
    value[CUTOUT_TOKEN_TYPE_INDEX] === CutoutTokenType.STRING
  ) {
    reverseLookupStrings = value[CUTOUT_TOKEN_VALUE_INDEX].trim()
      .split(/\s+/);
  }

  for (const string of reverseLookupStrings) {
    backend.add([
      INDEX_ATTRIBUTES_TOKEN,
      key,
      tokenizeValue(string),
      snapshot,
    ]);
  }
}

export function appendChild(
  backend: CutoutBackend,
  { snapshot = ROOT_SNAPSHOT_TOKEN, child: { token: child, index } }: {
    snapshot?: CutoutIdentifierToken;
    child: {
      token: CutoutIdentifierToken | CutoutPrimitiveToken;
      index: CutoutNumberToken;
    };
  },
) {
  if (child[CUTOUT_TOKEN_TYPE_INDEX] === CutoutTokenType.IDENTIFIER) {
    backend.add([
      INDEX_SNAPSHOTS_TOKEN,
      snapshot,
      INDEX_CHILDREN_TOKEN,
      index,
      child,
    ]);

    backend.add([
      INDEX_SNAPSHOTS_TOKEN,
      child,
      INDEX_PARENT_TOKEN,
      snapshot,
      index,
    ]);

    return;
  }

  backend.add([
    INDEX_SNAPSHOTS_TOKEN,
    snapshot,
    INDEX_CHILDREN_TOKEN,
    index,
    child,
  ]);
}
