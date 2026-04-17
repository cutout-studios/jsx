/** @jsxImportSource @cutout/jsx */

import { Window } from "happy-dom";
import { dom } from "./main.ts";
import { BenchGroups, manyRows, wikipediaHomePage } from ".bench";

const LIBRARY = "@cutout/jsx/format/dom";

Object.assign(globalThis, { document: new Window().document });

Deno.bench(
  LIBRARY,
  { group: BenchGroups.WIKIPEDIA_SPA, baseline: true },
  () => {
    dom(wikipediaHomePage());
  },
);

Deno.bench(
  LIBRARY,
  { group: BenchGroups.WIKIPEDIA_SSR, baseline: true },
  () => {
    dom(manyRows());
  },
);
