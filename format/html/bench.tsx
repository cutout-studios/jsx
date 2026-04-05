/** @jsxImportSource @cutout/jsx */

import { brotliCompressSync } from "node:zlib";
import { format as formatBytes } from "@std/fmt/bytes";

import { wikipediaOrg } from "./bench.html.tsx";
import { html } from "./html.ts";

const BENCH_GROUP = "format/html";

Deno.bench(`${BENCH_GROUP} - single value`, () => {
  html(<div></div>);
});

Deno.bench(`${BENCH_GROUP} - 100 rows`, (bench) => {
  const rows = Array.from({ length: 100 }, (_, i) => ({
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

Deno.bench(`${BENCH_GROUP} - 1000 rows, repeating`, (bench) => {
  const rows = Array.from({ length: 1000 }, () => ({
    content: "Row",
  }));

  bench.start();

  html(
    <div>
      {rows.map((row) => <div key={null}>{row.content}</div>)}
    </div>,
  );

  bench.end();
});

Deno.bench(`${BENCH_GROUP} - 1000 rows, varied`, (bench) => {
  const rows = Array.from({ length: 1000 }, (_, i) => ({
    id: `row-${i}`,
    class: i % 2 === 0 ? "even" : "odd",
    content: `Row #${i} - ${Math.random()}`,
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

let wikiSize: number | null = null;

Deno.bench(
  `${BENCH_GROUP} - wikipedia.org (no style/script tags)`,
  (bench) => {
    if (wikiSize === null) {
      const wikiData = html(wikipediaOrg());
      const encoder = new TextEncoder();
      wikiSize = encoder.encode(wikiData).byteLength;
      console.info(`[html size]: ${formatBytes(wikiSize)}`);
      console.info(
        `[html + br size]: ${
          formatBytes(brotliCompressSync(wikiData).byteLength)
        }`,
      );
    }

    bench.start();
    html(wikipediaOrg());
    bench.end();
  },
);

let largeDataSize: number | null = null;

Deno.bench(`${BENCH_GROUP} - 10000 rows`, (bench) => {
  const rows = Array.from({ length: 10000 }, (_, i) => ({
    id: `row-${i}`,
    class: i % 2 === 0 ? "even" : "odd",
    content: `Row #${i}`,
  }));

  if (largeDataSize === null) {
    const largeData = html(
      <div>
        {rows.map((row) => (
          <div id={row.id} class={row.class}>
            {row.content}
          </div>
        ))}
      </div>,
    );

    const encoder = new TextEncoder();
    largeDataSize = encoder.encode(largeData).byteLength;

    console.info(`[html size]: ${formatBytes(largeDataSize)}`);
    console.info(
      `[html + br size]: ${
        formatBytes(brotliCompressSync(largeData).byteLength)
      }`,
    );
  }

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
