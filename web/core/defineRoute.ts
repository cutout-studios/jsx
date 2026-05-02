import "@cutout/polyfill";
import type { Route } from "@std/http/route";
import type { ShapeFromDefinition, ShapeDefinition } from "./types.ts";

const DEFAULT_RESPONSE = new Response("Not Implemented.", { status: 501 });

enum SupportedRouteMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

type RouteDefinition<D extends ShapeDefinition> = {
  method?: SupportedRouteMethod;
  parameters: D;
  render: ( // TODO: parameter parsing
    parameters: ShapeFromDefinition<D>,
    request: Request,
  ) => Response;
};

export function defineRoute<D extends ShapeDefinition>(
  pathname: string,
  {
    render = () => DEFAULT_RESPONSE,
    ...definition
  }: RouteDefinition<D>,
): Route {
  return {
    method: definition.method,
    pattern: new URLPattern({ pathname }),

    // TODO: collapse params across url, querystring, body
    handler: (request, { pathname: { groups: parameters } }) =>
      render(parameters, request),
  };
}
