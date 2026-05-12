/** @jsxImportSourceTypes @cutout/web/format/html */

import { createRoute } from "@cutout/web";
import { html } from "@cutout/web/format";

import AppHome from "./App.tsx";

export default createRoute("/", {
  render() {
    return html(
      <html>
        <head>
          <title>Home Page</title>
        </head>
        <body>
          <AppHome username="Daniel" />
        </body>
      </html>,
    );
  },
});
