import { type Route, route } from "@std/http/route";

export function createServer(
  routes: Route[],
  // TODO: app root(s) to serve files
  definition: { defaultRoute: Route },
) {
  return (location: string = "[::1]:0") =>
    Deno.serve(
      {
        hostname: location,
      },
      route(
        routes,
        (request) =>
          definition.defaultRoute.handler(
            request,
            new URLPattern("").exec(new URL(request.url))!,
          ),
      ),
    );
}
