/** @jsxImportSource @cutout/jsx */

import { html } from "./main.ts";
import {
  wikipediaHomePage,
  manyRows,
  BenchGroups
} from ".bench";

const LIBRARY = "@cutout/jsx/format/html";

Deno.bench(
  LIBRARY,
  { group: BenchGroups.WIKIPEDIA_SSR, baseline: true },
  () => {
    html(wikipediaHomePage());
  },
);

Deno.bench(LIBRARY, {
  group: BenchGroups.MANY_ROW_SSR,
  baseline: true,
}, () => {
  html(manyRows());
});
