/** @jsxImportSource @cutout/jsx */
/** @jsxImportSourceTypes @cutout/jsx/format/html */

import { html } from "@cutout/jsx/format";
import { blue } from "@std/fmt/colors";
import { type Route, route } from "@std/http/route";

Deno.serve(
  {
    hostname: "localhost",
    onListen({ port, hostname }) {
      console.info(blue("Example HTML server started:"));
      console.info(
        `- Try ${
          blue(`http://[${hostname}]:${port}/echo/Hello,%20World!/`)
        } in your browser.`,
      );
      console.info(
        `- Try an XSS attack: ${
          blue(
            `http://[${hostname}]:${port}/echo/%3Cscript%3Ealert('attack!!')%3B%3C%2Fscript%3E/`,
          )
        }`,
      );
    },
  },
  route(
    [
      createHTMLRoute("/echo/:message/", ({ message = "No Message." }) => {
        const randomColor = `#${
          Math.floor(Math.random() * 16777215).toString(16)
        }`;

        return html(
          <html>
            <head>
              <title>HTML Example | {message}</title>

              <style>
                {/* css */ `h1 { color: ${randomColor}; }`}
              </style>
            </head>
            <body>
              <h1>{message}</h1>
            </body>
          </html>,
        );
      }),
    ],
    () => new Response("Not Found", { status: 404 }),
  ),
);

function createHTMLRoute(
  pathname: string,
  render: (params: Record<string, unknown>) => string,
): Route {
  return {
    pattern: new URLPattern({ pathname }),
    handler: (_request: Request, patternResult) => {
      const { groups: params } = patternResult?.pathname;

      return new Response(
        render(
          new Proxy({}, {
            get: (_, key) => decodeURIComponent(params[String(key)] ?? ""),
          }),
        ),
        {
          status: 200,
          headers: {
            "content-type": "text/html",
          },
        },
      );
    },
  };
}
