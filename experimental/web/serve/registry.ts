import type { CutoutRegistry } from "@cutout/web/components";
import { route } from "@std/http/route";

import type { Server } from "./types.ts";

export function serveRegistry(
  registry: CutoutRegistry,
  { hostname = "[::1]", port = 0 },
): Server {
  const routes = registry.getRoutes();

  // TODO: handle error
  const { addr: address } = Deno.serve(
    { hostname, port },
    route(routes, () => new Response("Not Found")),
  );

  console.info(`Server running @ http://${address.hostname}:${address.port}`);
  
  return {
    hostname: address.hostname,
    port: address.port,
  };
}
