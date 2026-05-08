import { route } from "@std/http/route";
import type { RouteResource } from "./types.ts";

export function createServer(
  routes: RouteResource[],
  // TODO: app root(s)?
  definition: { defaultRoute: RouteResource },
) {
  // TODO: serve fe stuff/assets
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
