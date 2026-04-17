/** @jsxImportSource react */

import { renderToString } from "react-dom/server";
import { BenchGroups, manyRows, wikipediaHomePage } from ".bench";

const LIBRARY = "react-dom/server";

Deno.bench(
  LIBRARY,
  { group: BenchGroups.WIKIPEDIA_SSR },
  () => {
    renderToString(wikipediaHomePage());
  },
);

Deno.bench(
  LIBRARY,
  { group: BenchGroups.MANY_ROW_SSR },
  () => {
    renderToString(manyRows());
  },
);
