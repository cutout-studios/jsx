/** @jsxImportSource @cutout/jsx */
import { brotliCompressSync } from "node:zlib";

import { wikipediaOrg } from "./bench.html.tsx";
import { pack } from "./pack.ts";

const BENCH_GROUP = "format/pack";

Deno.bench(`${BENCH_GROUP} - single value`, () => {
  pack(<div></div>);
});

Deno.bench(`${BENCH_GROUP} - 100 rows`, (bench) => {
  const rows = Array.from({ length: 100 }, (_, i) => ({
    id: `row-${i}`,
    class: i % 2 === 0 ? "even" : "odd",
    content: `Row #${i}`,
  }));

  bench.start();

  pack(
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

  pack(
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

  pack(
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

// TODO(#9): see if we can avoid GC
let wikiSize: number | null = null;

Deno.bench(
  `${BENCH_GROUP} - wikipedia.org (no style/script tags)`,
  (bench) => {
    if (wikiSize === null) {
      const wikiData = pack(wikipediaOrg());
      wikiSize = wikiData.byteLength;
      console.info(`[pack size]: ${(wikiSize / 1024).toFixed(2)} KB`);
      console.info(
        `[pack + br size]: ${
          (brotliCompressSync(wikiData).byteLength / 1024).toFixed(2)
        } KB`,
      );
    }

    bench.start();
    pack(wikipediaOrg());
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
    const largeData = pack(
      <div>
        {rows.map((row) => (
          <div id={row.id} class={row.class}>
            {row.content}
          </div>
        ))}
      </div>,
    );

    largeDataSize = largeData.byteLength;

    console.info(`[pack size]: ${(largeDataSize / 1024).toFixed(2)} KB`);
    console.info(
      `[pack + br size]: ${
        (brotliCompressSync(largeData).byteLength / 1024).toFixed(2)
      } KB`,
    );
  }

  bench.start();

  pack(
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
