/** @jsxImportSource @cutout/jsx */

import { DOMParser } from "@b-fuze/deno-dom";

import { wikipediaOrg } from "./bench.html.tsx";
import { elements } from "./elements/main.ts";
import { html } from "./html/main.ts";

globalThis.document = new DOMParser().parseFromString(
  "<!DOCTYPE html><html><body></body></html>",
  "text/html",
) as unknown as Document;

Deno.bench(
  `format/element - wikipedia.org`,
  { group: "wikipedia.org (no style/script tags)" },
  () => {
    elements(wikipediaOrg())[0].outerHTML;
  },
);

Deno.bench(
  `format/html - wikipedia.org`,
  { group: "wikipedia.org (no style/script tags)" },
  () => {
    html(wikipediaOrg());
  },
);

Deno.bench(`format/element - 10000 rows`, { group: "10000 rows" }, (bench) => {
  const rows = Array.from({ length: 10000 }, (_, i) => ({
    id: `row-${i}`,
    class: i % 2 === 0 ? "even" : "odd",
    content: `Row #${i}`,
  }));

  bench.start();

  elements(
    <div>
      {rows.map((row) => (
        <div id={row.id} class={row.class}>
          {row.content}
        </div>
      ))}
    </div>,
  )[0].outerHTML;

  bench.end();
});

Deno.bench(`format/html - 10000 rows`, { group: "10000 rows" }, (bench) => {
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
