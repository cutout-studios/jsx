/** @jsxImportSource react */

import { renderToString } from "react-dom/server";
import { BenchGroups, react } from ".bench";

const LIBRARY = "react-dom/server";

Deno.bench(
  LIBRARY,
  { group: BenchGroups.WIKIPEDIA_SSR },
  () => {
    renderToString(react.wikipediaHomePage());
  },
);

Deno.bench(
  LIBRARY,
  { group: BenchGroups.MANY_ROW_SSR },
  () => {
    renderToString(react.manyRows());
  },
);
