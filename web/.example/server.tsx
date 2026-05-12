/** @jsxImportSourceTypes @cutout/web/format/html */

import { createRoute, createServer } from "@cutout/web";
import { html } from "@cutout/web/format";
import { join } from "@std/path";
import { AppHome } from "./elements/App.tsx";


const home = createRoute("/", {
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

const server = createServer([home], {
  appRoot: new URL(join(Deno.cwd(), "./elements")),
  errorHandler: (error) => {
    return html(
      <html>
        <head>
          <title>{error.message}</title>
        </head>
        <body>
          {error.toString()}
        </body>
      </html>
    );
  },
});

server();
