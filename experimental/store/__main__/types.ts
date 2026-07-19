import type { XOJSXToken } from "@cutout/jsx/tokens";
import type { XOStoreSelector } from "@cutout/store/selector";

export type Store = {
  append(jsx: XOJSXToken): void;
  select(selectors: XOStoreSelector[]): XOJSXToken[];
};
