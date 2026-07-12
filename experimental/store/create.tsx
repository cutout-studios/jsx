/** @jsxImportSource @cutout/jsx */

import type { CutoutJSXToken } from "@cutout/jsx/tokens";
import type { CutoutBackend, CutoutBackendPath } from "@cutout/store/backend";
import type { CutoutStoreSelector } from "@cutout/store/selector";

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

export const create = ({ backend }: Options): Store => {
  return {
    append(jsx: CutoutJSXToken) {
      const paths: CutoutBackendPath[] = [];

      // TODO: convert jsx to paths

      for (const path of paths) {
        backend.add(path);
      }
    },

    query(): CutoutJSXToken {
      // TODO: using indicies, load node id paths

      // TODO: convert paths back to jsx node(s)

      return <></>;
    },
  };
};
