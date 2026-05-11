import "@cutout/polyfill";

import { type Route, route } from "@std/http/route";

// TODO: errorRoute
// TODO: app root(s) to serve files. check routes to make sure they don't overlap.
export function createServer(
  routes: Route[],
  definition: { defaultRoute: Route; errorRoute: Route; appRoot: URL },
) {
  return (location: URL = new URL("http://[::1]:0")) => {
    Deno.serve(
      {
        hostname: location.hostname,
        port: Number(location.port),
      },
      route(
        routes,
        (request) =>
          definition.defaultRoute.handler(
            request,
            _createDefaultMatch(request.url),
          ),
      ),
    );
  };
}

// TODO: really?
function _createDefaultMatch(url: string): URLPatternResult {
  const parsed = new URL(url);
  return {
    inputs: [parsed],
    protocol: { input: parsed.protocol, groups: {} },
    username: { input: parsed.username, groups: {} },
    password: { input: parsed.password, groups: {} },
    hostname: { input: parsed.hostname, groups: {} },
    port: { input: parsed.port, groups: {} },
    pathname: { input: parsed.pathname, groups: {} },
    search: { input: parsed.search, groups: {} },
    hash: { input: parsed.hash, groups: {} },
  };
}
