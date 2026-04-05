/** @jsxImportSource @cutout/jsx */

import { pack } from "./pack.ts";

const BENCH_GROUP = "format/pack";

Deno.bench(`${BENCH_GROUP} - single value`, () => {
  pack(<div></div>);
});

// TODO ...

// Deno.bench(`${BENCH_GROUP} - 100 rows`);

// Deno.bench(`${BENCH_GROUP} - 1000 rows, repeating data`);

// Deno.bench(`${BENCH_GROUP} - 1000 rows, varied data`);

// Deno.bench(`${BENCH_GROUP} - 10000 rows`);

// Deno.bench(`${BENCH_GROUP} - bench.html.jsx (real-world example)`);
