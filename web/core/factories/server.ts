import { type Route, route } from "@std/http/route";

export function createServer(
  location: string = "[::1]:0",
  definition: { routes: Route[]; default: Route },
) {
  return () =>
    Deno.serve(
      {
        hostname: location,
      },
      route(
        definition.routes,
        (request) =>
          definition.default.handler(
            request,
            new URLPattern("").exec(new URL(request.url))!,
          ),
      ),
    );
}
