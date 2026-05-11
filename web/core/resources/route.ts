import type { AnyShape } from "@cutout/common";
import type { Route } from "@std/http/route";

import { parseRawShapeFromDefinition } from "../common.ts";
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
  return {
    method: definition.method,
    pattern: new URLPattern({ pathname }),

    handler: async (request, { pathname: { groups: parameters } }) => {
      // TODO: unify this
      const requestBody = await _parseRequest(request) || {};
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
      } catch (error) { // TODO: dev vs. prod level of error
        if (error instanceof CutoutError) {
          return new Response(error.toString(), {
            status: error.httpCode,
          });
        }

        if (error instanceof Error) {
          return new Response(error.stack ?? error.message, {
            status: CutoutSupportedHTTPCode.SERVER_ERROR,
          });
        }

        return new Response(String(error), {
          status: CutoutSupportedHTTPCode.SERVER_ERROR,
        });
      }
    },
  };
}

async function _parseRequest(request: Request) {
  if (request.bodyUsed) {
    return null; // TODO: error?
  }

  const contentType = (request.headers.get('content-type') ?? '').toLocaleLowerCase();

  // TODO: SupportedRouteContentType
  if (contentType.includes('application/json')) {
    return request.json();
  }

  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData();
    const result: AnyShape = {};
    for (const [key, value] of formData.entries()) {
      result[key] = value;
    }

    return result;
  }


  return null;
}