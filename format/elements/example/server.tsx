/** @jsxImportSource @cutout/jsx */
/** @jsxImportSourceTypes @cutout/jsx/format/html */

import { blue } from "@std/fmt/colors";
import { join } from "@std/path";

import { html } from "../../html/main.ts";

Deno.serve(
  {
    hostname: "localhost",
    onListen({ port, hostname }) {
      console.info(
        `Example WebComponent Server started: ${
          blue(`http://[${hostname}]:${port}/`)
        }`,
      );
    },
  },
  async (request) => {
    const pathname = new URL(request.url).pathname;
    if (pathname.startsWith("/app") && pathname.endsWith(".tsx")) {
      // no minification, for demo purposes
      const [result] = (await Deno.bundle({
        entrypoints: [join(new URL(".", import.meta.url), pathname)],
      })).outputFiles ?? [];

      return new Response(result.text(), {
        status: 200,
        headers: {
          "content-type": "application/javascript",
        },
      });
    }

    return new Response(
      html(
        <html>
          <head>
            <title>WebComponent Example</title>
            <script type="module" src="/app/element.tsx"></script>
          </head>
          <body>
            <example-element color="black"></example-element>
          </body>
        </html>,
      ),
      {
        status: 200,
        headers: {
          "content-type": "text/html",
        },
      },
    );
  },
);
