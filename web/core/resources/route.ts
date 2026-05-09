import type { Route } from "@std/http/route";

import { getCallerLocation, parseRawShapeFromDefinition } from "../common.ts";
import { CutoutError, CutoutSupportedHTTPCode } from "../errors/module.ts";
import type { ShapeDefinition, ShapeFromDefinition } from "../types.ts";

const DEFAULT_RESPONSE = new Response("Not Implemented.", {
  status: CutoutSupportedHTTPCode.NOT_IMPLEMENTED,
});

enum SupportedRouteMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

type RouteDefinition<D extends ShapeDefinition> = {
  method?: SupportedRouteMethod;
  parameters?: D;
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
  const route: Route = {
    method: definition.method,
    pattern: new URLPattern({ pathname }),

    handler: async (request, { pathname: { groups: parameters } }) => {
      const requestBody = !request.bodyUsed && (await request.json()) || {};
      const urlParameters = definition.parameters
        ? parseRawShapeFromDefinition<D>(
          parameters,
          definition.parameters,
        )
        : {};

      try {
        return render(
          Object.assign({}, requestBody, urlParameters),
          request,
        );
      } catch (error) {
        if (error instanceof CutoutError) {
          return new Response(error.toString(), {
            status: error.httpCode,
          });
        }

        if (error instanceof Error) {
          return new Response(error.message, {
            status: CutoutSupportedHTTPCode.SERVER_ERROR,
          });
        }

        return new Response(String(error), {
          status: CutoutSupportedHTTPCode.SERVER_ERROR,
        });
      }
    },
  };

  return Object.assign(route, {
    location: getCallerLocation()!,
  });
}
