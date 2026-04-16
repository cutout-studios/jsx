/** @jsxImportSource @cutout/jsx */

import { PropertySymbol, Window } from "happy-dom";
import { wikipediaOrg } from "./bench.html.tsx";
import { dom } from "./dom/main.ts";
import { html } from "./html/main.ts";

Deno.bench(
  `format/html - wikipedia.org`,
  { group: "wikipedia.org (no style/script tags)" },
  () => {
    html(wikipediaOrg());
  },
);

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

const window = new Window();
const document = window.document;
const browserWindow = document[PropertySymbol.window];

const setInnerHTML = (html: string) =>
  document.documentElement.innerHTML = html;
const cancelAsync = () => window.happyDOM.abort();

Object.assign(globalThis, {
  window,
  document,
  HTMLElement: browserWindow.HTMLElement,
  Element: browserWindow.Element,
  Node: browserWindow.Node,
  navigator: browserWindow.navigator,
  DocumentFragment: browserWindow.DocumentFragment,
  DocumentType: browserWindow.DocumentType,
  SVGElement: browserWindow.SVGElement,
  Text: browserWindow.Text,
  requestAnimationFrame: browserWindow.requestAnimationFrame,
  cancelAnimationFrame: browserWindow.cancelAnimationFrame,
  setTimeout: browserWindow.setTimeout,
  clearTimeout: browserWindow.clearTimeout,
  setInterval: browserWindow.setInterval,
  clearInterval: browserWindow.clearInterval,
  queueMicrotask: browserWindow.queueMicrotask,
  abortController: browserWindow.AbortController,
  cancelAsync,
  setInnerHTML,
});

Deno.bench(
  `format/dom via happy-dom - wikipedia.org`,
  { group: "wikipedia.org (no style/script tags)" },
  () => {
    dom(wikipediaOrg())[0].outerHTML;
  },
);

Deno.bench(
  `format/dom via happy-dom - 10000 rows`,
  { group: "10000 rows" },
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
