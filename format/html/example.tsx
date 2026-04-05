/** @jsxImportSource @cutout/jsx */

import { html } from "@cutout/jsx/format";
import { route } from "@std/http/route";

// TODO: `style` and `script` tags.
Deno.serve(
  {
    hostname: "localhost",
    onListen({ port, hostname }) {
      console.info("Server started!");
      console.info(`- test 'http://[${hostname}]:${port}/echo/Hello,%20World!' in your browser`);
      console.info(`- test XSS attack: 'http://[${hostname}]:${port}/echo/%3Cscript%3Ealert('hi')%3B%3C%2Fscript%3E'`);
    },
  },
  route(
    [
      {
        pattern: new URLPattern({ pathname: "/echo/:message" }),
        handler: (_req: Request, params) => {
          const message = decodeURIComponent(params?.pathname.groups.message ?? "");

          return new Response(
            html(
              <html>
                <head>
                  <title>{message}</title>
                </head>
                <body>
                  <h1>{message}</h1>
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
      }
    ],
    () => new Response("Not Found", { status: 404 }),
  ),
);
