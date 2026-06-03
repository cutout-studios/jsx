import { CutoutError } from "@cutout/web/errors";
import { html } from "@cutout/web/projections";
import type { Route as StandardRoute } from "@std/http/route";
import { contentType, getCharset } from "@std/media-types";

import {
  ROUTE_CONTENT_TYPE_DEFAULT,
  ROUTE_CSP_HEADER_DEFAULT,
  ROUTE_FILE_EXTENSION_DEFAULT,
  SupportedHTTPHeaders,
} from "./constants.ts";
import { parseRawValue } from "./parse.ts";
import type { Type, Endpoint, EndpointOptions, ShapeFor } from "./types.ts";

export function createEndpoint<const D extends Type>(
  path: string,
  { type: definition, render }: EndpointOptions<D>,
): Endpoint<D> {
  const sanitizedPath = _sanitizePath(path);

  const result = class implements StandardRoute {
    path = sanitizedPath;
    pattern = new URLPattern({ pathname: sanitizedPath });
    handler = async (
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

      const renderResult = await render?.(params, request);

      if (!renderResult) {
        throw new CutoutError();
      }

      let responseBody;
      if (typeof renderResult === "string") {
        responseBody = renderResult;
      } else {
        switch (this.#contentType) {
          case "text/html": // TODO(#75): Inject importmaps by integrity hash, etc.
          default:
            responseBody = html(renderResult);
        }
      }

      return new Response(responseBody, {
        // TODO(#70): In production, construct request-specific headers: CORS, CSP & Session Token
        "headers": this.#defaultHeaders,
      });
    };

    #extension = sanitizedPath.match(/\..+$/)?.[0] ??
      ROUTE_FILE_EXTENSION_DEFAULT;
    #contentType = contentType(this.#extension) ?? ROUTE_CONTENT_TYPE_DEFAULT;
    #defaultHeaders = {
      [SupportedHTTPHeaders.CONTENT_TYPE]: `charset=${
        getCharset(this.#contentType)
      }; ${this.#contentType}`,
      [SupportedHTTPHeaders.CSP]: ROUTE_CSP_HEADER_DEFAULT,
    };
  };

  return Reflect.construct(result, []);
}

function _sanitizePath(rawRouteText: string): string {
  const pathSegments: string[] = [];

  for (let segment of rawRouteText.split(/\/+/)) {
    let isVariable = false, isOptional = false;

    if (!segment) {
      continue;
    }

    if (segment.startsWith(":")) {
      isVariable = true;
      segment = segment.slice(1);
    }

    if (segment.endsWith("?")) {
      isOptional = true;
      segment = segment.slice(0, segment.length - 1);
    }

    segment = encodeURIComponent(segment);

    pathSegments.push(
      `${isVariable ? ":" : ""}${segment}${isOptional ? "?" : ""}`,
    );
  }

  return `/${pathSegments.join("/")}`;
}
