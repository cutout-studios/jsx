import { type CutoutSymbolToken, CutoutTokenType } from "@cutout/jsx/tokens";

export const DEFAULT_IDENTIFIER_BYTE_LENGTH = 16;

const BIN_DEPTH = 2;
const BIN_TO_BYTES = 8;
export const BYTE_DEPTH = BIN_DEPTH ** BIN_TO_BYTES;
export const TIMESTAMP_BYTE_LIMIT = 6;

export const INDEX_SNAPSHOTS_TOKEN: CutoutSymbolToken = [
  CutoutTokenType.SYMBOL,
  Symbol.for("snapshots"),
];

export const INDEX_TAGS_TOKEN: CutoutSymbolToken = [
  CutoutTokenType.SYMBOL,
  Symbol.for("tags"),
];

export const INDEX_ATTRIBUTES_TOKEN: CutoutSymbolToken = [
  CutoutTokenType.SYMBOL,
  Symbol.for("attributes"),
];
