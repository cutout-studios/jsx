import {
  type CutoutIdentifierToken,
  type CutoutStringToken,
  CutoutTokenType,
} from "@cutout/jsx/tokens";

export const DEFAULT_IDENTIFIER_BYTE_LENGTH = 16;
export const DEFAULT_IDENTIFIER_ALPHABET =
  "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";

const BIN_DEPTH = 2;
export const BIN_TO_BYTES = 8;
export const BYTE_DEPTH = BIN_DEPTH ** BIN_TO_BYTES;
export const TIMESTAMP_BYTE_LIMIT = 6;

// TODO: use 'tokenizeValue'
export const ROOT_SNAPSHOT_TOKEN: CutoutIdentifierToken = [
  CutoutTokenType.IDENTIFIER,
  "",
];

export const INDEX_SNAPSHOTS_TOKEN: CutoutStringToken = [
  CutoutTokenType.STRING,
  "snapshots",
];

export const INDEX_TAGS_TOKEN: CutoutStringToken = [
  CutoutTokenType.STRING,
  "tags",
];

export const INDEX_ATTRIBUTES_TOKEN: CutoutStringToken = [
  CutoutTokenType.STRING,
  "attributes",
];

export const INDEX_PARENT_TOKEN: CutoutStringToken = [
  CutoutTokenType.STRING,
  "parent",
];

export const INDEX_CHILDREN_TOKEN: CutoutStringToken = [
  CutoutTokenType.STRING,
  "children",
];
