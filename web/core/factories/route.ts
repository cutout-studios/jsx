import "@cutout/polyfill";
import type { Route } from "@std/http/route";
import type { ShapeDefinition, ShapeFromDefinition } from "../types.ts";
import { parseRawShapeFromDefinition } from "../types.ts";

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
  render: (
    parameters: ShapeFromDefinition<D>,
    request: Request,
  ) => Response;
};

export function createRoute<D extends ShapeDefinition>(
  pathname: string,
  {
    render = () => DEFAULT_RESPONSE,
    ...definition
  }: RouteDefinition<D>,
): Route {
  return {
    method: definition.method,
    pattern: new URLPattern({ pathname }),

    // TODO: this is very basic.
    handler: async (request, { pathname: { groups: parameters } }) => {
      const requestBody = !request.bodyUsed && (await request.json()) || {};
      const urlParameters = parseRawShapeFromDefinition<D>(parameters, definition.parameters);
      
      return render(
        Object.assign({}, requestBody, urlParameters),
        request,
      ),
    }
  };
}
