import "@cutout/polyfill";

import { CutoutError, CutoutErrorCode } from "@cutout/web";
import { serveDir } from "@std/http/file-server";
import { type Route, route } from "@std/http/route";

type CutoutServerOptions = {
  routes: Route[];
  systemRoot: URL;
  errorHandler: (error: CutoutError) => Response
}


// TODO: more specific error types
export function createServer(
  { routes, systemRoot, errorHandler }: CutoutServerOptions
) {
  return (location: URL = new URL("http://[::1]:0")) => {
    Deno.serve(
      {
        hostname: location.hostname,
        port: Number(location.port),
      },
      route(
        [{
          method: ["GET"],
          pattern: new URLPattern({
            // TODO: the path math here is bad
            pathname: systemRoot.pathname + "/*",
          }),
          handler: async (request) => {
            const fileURL = new URL(request.url);

            if (request.url.endsWith(".tsx")) {
              // TODO: dev vs. prod settings
              const result = await Deno.bundle({
                entrypoints: [fileURL.toString()],
                format: "esm",
                inlineImports: false,
                minify: true,
                keepNames: false,
                sourcemap: "linked",
                codeSplitting: true,
                packages: "external",
                platform: "browser",
                write: false,
              });

              if (result.errors) {
                return errorHandler(
                  new CutoutError(CutoutErrorCode.OPERATION_FAILURE, {
                    context: request,
                  }),
                );
              }

              if (!result.outputFiles) {
                return errorHandler(
                  new CutoutError(CutoutErrorCode.OPERATION_FAILURE, {
                    context: request,
                  }),
                );
              }

              const builtFile = result.outputFiles.find((file) =>
                file.path === fileURL.pathname
              );

              if (!builtFile) {
                return errorHandler(
                  new CutoutError(CutoutErrorCode.OPERATION_FAILURE, {
                    context: request,
                  }),
                );
              }

              return new Response(builtFile.text(), {
                headers: {
                  "content-type": "charset=utf-8; text/javascript",
                },
              });
            }

            return serveDir(request, { fsRoot: systemRoot.toString() });
          },
        }, ...routes],
        (request) =>
          errorHandler(
            new CutoutError(CutoutErrorCode.DATA_UNKNOWN, { context: request }),
          ),
      ),
    );
  };
}
