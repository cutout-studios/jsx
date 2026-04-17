/** @jsxImportSource @cutout/jsx */

import { Window } from "happy-dom";
import { wikipediaOrg } from "../.bench/wikipedia.tsx";
import { dom } from "./main.ts";

Object.assign(globalThis, { document: new Window().document });

Deno.bench(
  `format/dom via happy-dom - wikipedia.org`,
  { group: "wikipedia.org (no style/script tags) - dom", baseline: true },
  () => {
    dom(wikipediaOrg())[0].outerHTML;
  },
);

Deno.bench(
  `format/dom via happy-dom - 10000 rows`,
  { group: "10000 rows - dom", baseline: true },
  (bench) => {
    const rows = Array.from({ length: 10000 }, (_, i) => ({
      id: `row-${i}`,
      class: i % 2 === 0 ? "even" : "odd",
      content: `Row #${i}`,
    }));

    bench.start();

    dom(
      <div>
        {rows.map((row) => (
          <div id={row.id} class={row.class}>
            {row.content}
          </div>
        ))}
      </div>,
    )[0].outerHTML;

    bench.end();
  },
);
