/** @jsxImportSource @cutout/jsx */

import type { CutoutJSXToken } from "@cutout/jsx/tokens";
import type { CutoutBackend } from "@cutout/store/backend";

import type { CSSSelector } from "./cssSelector.ts";

type Options = {
  backend: CutoutBackend;
}

type QueryOptions = {
  limit?: number;
}

export class DocumentStore {
  #backend: CutoutBackend;

  constructor({ backend }: Options) {
    this.#backend = backend;
  }

  append(jsx: CutoutJSXToken) {
    // TODO: convert to paths
    // add paths to store
  }

  query(selector: CSSSelector, { limit = 1 }: QueryOptions = {}): CutoutJSXToken {
    // using indicies, load node id paths
    // convert paths back to jsx node(s)

    return <></>;
  }
}
