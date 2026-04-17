/** @jsxImportSource @cutout/jsx */

import { wikipediaOrg } from "../.bench/wikipedia.tsx";
import { html } from "./main.ts";

Deno.bench(
  `format/html - wikipedia.org`,
  { group: "wikipedia.org (no style/script tags) - string", baseline: true },
  () => {
    html(wikipediaOrg());
  },
);

Deno.bench(`format/html - 10000 rows`, {
  group: "10000 rows - string",
  baseline: true,
}, (bench) => {
  const rows = Array.from({ length: 10000 }, (_, i) => ({
    id: `row-${i}`,
    class: i % 2 === 0 ? "even" : "odd",
    content: `Row #${i}`,
  }));

  bench.start();

  html(
    <div>
      {rows.map((row) => (
        <div id={row.id} class={row.class}>
          {row.content}
        </div>
      ))}
    </div>,
  );

  bench.end();
});
