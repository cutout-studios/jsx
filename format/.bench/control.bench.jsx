/** @jsxImportSource react */

import { Window } from "happy-dom";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { wikipediaOrg } from "./control.wikipedia.jsx";

Deno.bench(
  `react-dom/server - wikipedia.org`,
  { group: "wikipedia.org (no style/script tags) - string" },
  () => {
    renderToString(wikipediaOrg());
  },
);

Deno.bench(
  `react-dom/server - 10000 rows`,
  { group: "10000 rows - string" },
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

const window = new Window();
Object.assign(globalThis, {
  window,
  document: window.document,
  HTMLElement: window.HTMLElement,
  Element: window.Element,
  Node: window.Node,
  navigator: window.navigator,
  // React also probes these during client render:
  MessageChannel: {},
  queueMicrotask: window.queueMicrotask,
});

Deno.bench(
  `react-dom/client via happy-dom - wikipedia.org`,
  { group: "wikipedia.org (no style/script tags) - dom" },
  (bench) => {
    const container = globalThis.document.documentElement;
    const root = createRoot(container);
    bench.start();
    flushSync(() => root.render(wikipediaOrg()));
    bench.end();
    container.outerHTML;
    root.unmount();
  },
);

Deno.bench(
  `react-dom/client via happy-dom - 10000 rows`,
  { group: "10000 rows - dom", baseline: true },
  (bench) => {
    const rows = Array.from({ length: 10000 }, (_, i) => ({
      id: `row-${i}`,
      className: i % 2 === 0 ? "even" : "odd",
      content: `Row #${i}`,
    }));

    const container = document.createElement("div");
    const root = createRoot(container);
    bench.start();
    flushSync(() =>
      root.render(
        <div>
          {rows.map((row) => (
            <div key={row.id} id={row.id} className={row.className}>
              {row.content}
            </div>
          ))}
        </div>,
      )
    );
    bench.end();
    container.outerHTML;
    root.unmount();
  },
);
