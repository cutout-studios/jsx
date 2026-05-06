/** @jsxImportSource @cutout/jsx */

import { Window } from "happy-dom";
import { dom } from "./main.ts";
import { BenchGroups, cutout } from ".bench";

const LIBRARY = "@cutout/jsx/format/dom";

Object.assign(globalThis, { document: new Window().document });

Deno.bench(
  LIBRARY,
  { group: BenchGroups.WIKIPEDIA_SPA, baseline: true },
  () => {
    dom(cutout.wikipediaHomePage());
  },
);

Deno.bench(
  LIBRARY,
  { group: BenchGroups.MANY_ROW_SPA, baseline: true },
  () => {
    dom(cutout.manyRows());
  },
);
