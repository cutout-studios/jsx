/** @jsxImportSource @cutout/jsx */

import { html } from "./main.ts";
import { BenchGroups, cutout } from ".bench";

const LIBRARY = "@cutout/jsx/format/html";

Deno.bench(
  LIBRARY,
  { group: BenchGroups.WIKIPEDIA_SSR, baseline: true },
  () => {
    html(cutout.wikipediaHomePage());
  },
);

Deno.bench(LIBRARY, {
  group: BenchGroups.MANY_ROW_SSR,
  baseline: true,
}, () => {
  html(cutout.manyRows());
});
