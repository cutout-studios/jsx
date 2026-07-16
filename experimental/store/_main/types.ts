import type { CutoutJSXToken } from "@cutout/jsx/tokens";
import type { CutoutStoreSelector } from "@cutout/store/selector";

// TODO: options
export type Store = {
  append(jsx: CutoutJSXToken): void;
  select(selectors: CutoutStoreSelector[]): CutoutJSXToken;
};
