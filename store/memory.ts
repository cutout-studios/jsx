import { entries } from "@cutout/jsx/projections";

import { Store } from "./types.ts";

export class MemoryStore implements Store {
  #map: Map<string[], string>;

  constructor(jsx, options) {
    this.#map = new Map(entries(jsx));
  }
}
