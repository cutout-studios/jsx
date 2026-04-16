import { renderToString } from "react-dom/server";
import { wikipediaOrg } from "./wikipedia.tsx";

Deno.bench(
  `react-dom/server - wikipedia.org`,
  { group: "wikipedia.org (no style/script tags)" },
  () => {
    renderToString(wikipediaOrg());
  },
);

Deno.bench(
  `react-dom/server - 10000 rows`,
  { group: "10000 rows" },
  (bench) => {
    const rows = Array.from({ length: 10000 }, (_, i) => ({
      id: `row-${i}`,
      class: i % 2 === 0 ? "even" : "odd",
      content: `Row #${i}`,
    }));
    bench.start();
    renderToString(
      <div>
        {rows.map((row) => (
          <div key={row.id} id={row.id} className={row.class}>
            {row.content}
          </div>
        ))}
      </div>,
    );
    bench.end();
  },
);
