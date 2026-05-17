import { CutoutError, CutoutErrorCode } from "@cutout/web/errors";
import type { Route } from "@std/http/route";
import { contentType, getCharset } from "@std/media-types";

import { type Registry, SYSTEM_REGISTRY } from "./base.ts";
import type {
  DefinitionConstructor,
  EntryDefinition,
  ShapeFor,
} from "./types.ts";

enum SupportedHTTPHeaders {
  CONTENT_TYPE = "Content-Type",
  CSP = "Content-Security-Policy",
  CORS = "Access-Control-Allow-Origin",
}

export function registerRoute<D extends EntryDefinition>(
  routeText: string,
  { registry = SYSTEM_REGISTRY, definition, render }: {
    registry: Registry;
    definition: D;
    render: (params: ShapeFor<D>, request: Request) => string;
  },
) {
  const sanitizedRouteText = sanitizeRouteText(routeText);

  return registry.define(
    routeText,
    class implements Route {
      name = sanitizedRouteText;
      path = sanitizedRouteText;
      pattern = new URLPattern({ pathname: sanitizedRouteText });
      #extension = sanitizedRouteText.match(/\..+$/)?.[0] ?? ".txt";
      #contentType = contentType(this.#extension) ?? "text/plain";
      #defaultHeaders = {
        [SupportedHTTPHeaders.CONTENT_TYPE]: `charset=${
          getCharset(this.#contentType)
        }; ${this.#contentType}`,
        [SupportedHTTPHeaders.CSP]: "default-src 'self'",
      };
      handler = (
        request: Request,
        { pathname, search, hash }: URLPatternResult,
      ) => {
        const params: ShapeFor<D> = {};

        for (const key in definition) {
          const extractedValue = pathname.groups[key] ?? search.groups[key] ??
            hash.groups[key];

          if (typeof extractedValue === "undefined") continue;

          params[key] = parseRawValue(extractedValue, definition[key]);
        }

        const responseBody = render(params, request);

        return new Response(responseBody, {
          // TODO(#): Construct request-specific headers: CORS, CSP & Session Token
          "headers": this.#defaultHeaders,
        });
      };
    },
  );
}

function sanitizeRouteText(rawRouteText: string): string {
  const pathSegments: string[] = [];

  for (const segment of rawRouteText.split(/\/+/)) {
    // TODO: handle ":"
    pathSegments.push(encodeURIComponent(segment));
  }

  return `/${pathSegments.join("/")}`;
}

function parseRawValue(value: string, ctor: DefinitionConstructor) {
  switch (ctor) {
    case Number:
      return Number(value);
    case String:
      return value;
    case Boolean:
      return value === "";
    case Symbol:
      return Symbol(value);
    case Array:
    case Object:
      try {
        return JSON.parse(value);
      } catch (error) {
        throw new CutoutError(CutoutErrorCode.DATA_CORRUPTED, {
          context: value,
          cause: error,
        });
      }
    case Function:
      throw new CutoutError(CutoutErrorCode.OPERATION_INSECURE, {
        context: value,
      });
    default:
      throw new CutoutError(CutoutErrorCode.DATA_UNKNOWN, {
        context: value,
      });
  }
}
