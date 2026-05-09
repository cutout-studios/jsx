import "@cutout/polyfill";

import { type Route, route } from "@std/http/route";

export function createServer(
  routes: Route[],
  // TODO: app root(s) to serve files
  definition: { defaultRoute: Route },
) {
  return (location: URL = new URL("http://[::1]:0")) => {
    Deno.serve(
      {
        hostname: location.hostname,
        port: Number(location.port)
      },
      route(
        routes,
        (request) =>
          definition.defaultRoute.handler(
            request,
            // TODO: a relative input without a base URL is not valid
            new URLPattern("").exec(new URL(request.url))!,
          ),
      ),
    );
  }
}
