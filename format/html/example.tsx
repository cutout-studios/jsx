/** @jsxImportSource @cutout/jsx */

import { html } from "@cutout/jsx/format";
import { blue } from "@std/fmt/colors";
import { route } from "@std/http/route";

Deno.serve(
  {
    hostname: "localhost",
    onListen({ port, hostname }) {
      console.info(blue("Example HTML server started:"));
      console.info(
        `- Try ${
          blue(`http://[${hostname}]:${port}/echo/Hello,%20World!`)
        } in your browser.`,
      );
      console.info(
        `- Try an XSS attack: ${
          blue(
            `http://[${hostname}]:${port}/echo/%3Cscript%3Ealert('attack!!')%3B%3C%2Fscript%3E`,
          )
        }`,
      );
    },
  },
  route(
    [
      {
        pattern: new URLPattern({ pathname: "/echo/:message" }),
        handler: (_req: Request, params) => {
          const message = decodeURIComponent(
            params?.pathname.groups.message ?? "",
          );
          const randomColor = `#${
            Math.floor(Math.random() * 16777215).toString(16)
          }`;

          return new Response(
            html(
              <html>
                <head>
                  <title>{message}</title>

                  <style>
                    {/* css */ `
                      h1 { 
                        color: ${randomColor};
                      }
                    `}
                  </style>
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
      },
    ],
    () => new Response("Not Found", { status: 404 }),
  ),
);
