// deno-lint-ignore-file import-order/import-order

// Compare SSR (server-side) methods
import "./.control.ssr.jsx";
import "../format/dom/.compare.spa.tsx";

// Compare SPA (client-side) methods
import "./.control.spa.jsx";
import "../format/html/.compare.ssr.tsx";
