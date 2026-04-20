// deno-lint-ignore-file import-order/import-order

// Compare SSR (server-side) methods
import "./benchPartial.ssr.jsx"; // control
import "../format/dom/benchPartial.tsx";

// Compare SPA (client-side) methods
import "./benchPartial.spa.jsx"; // control
import "../format/html/benchPartial.tsx";
