/** @jsxImportSource react */

import { Window } from "happy-dom";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import { BenchGroups, react } from ".bench";

const LIBRARY = "react-dom/client";

// Minimal API for react-dom/client
const window = new Window();
Object.assign(globalThis, {
  window,
  document: window.document,
  HTMLElement: window.HTMLElement,
  Element: window.Element,
  Node: window.Node,
  navigator: window.navigator,
  MessageChannel: {},
  queueMicrotask: window.queueMicrotask,
});

Deno.bench(
  LIBRARY,
  { group: BenchGroups.WIKIPEDIA_SPA },
  (bench) => {
    const root = createRoot(document.documentElement);
    bench.start();

    flushSync(() => root.render(react.wikipediaHomePage()));

    bench.end();
    root.unmount();
  },
);

Deno.bench(
  LIBRARY,
  { group: BenchGroups.MANY_ROW_SPA },
  (bench) => {
    const root = createRoot(document.documentElement);
    bench.start();

    flushSync(() => root.render(react.manyRows()));

    bench.end();
    root.unmount();
  },
);
