import type { CutoutOutputToken } from "@cutout/jsx/tokens";

import type { Projection } from "./types.ts";

type EntriesOptions = {
  extract: {
    keys: string[];
    values: string[];
  };
};

const DEFAULT_EXTRACTION_KEYS = ["key", "id", "name"];
const DEFAULT_EXTRACTION_VALUES = ["children", "value"];

export const entries: Projection<
  Array<[key: CutoutOutputToken[], value: CutoutOutputToken]>,
  EntriesOptions
> = (
  [, generator],
  {
    extract: {
      keys = DEFAULT_EXTRACTION_KEYS,
      values = DEFAULT_EXTRACTION_VALUES,
    },
  } = {},
) => {
};
