import type { CutoutGeneratorToken } from "@cutout/jsx/tokens";
import { html } from "@cutout/web/formats";
import type { Route } from "@std/http/route";
import { contentType, getCharset } from "@std/media-types";

import { type BaseRegistry, SYSTEM_REGISTRY } from "../base.ts";
import {
  ROUTE_CONTENT_TYPE_DEFAULT,
  ROUTE_CSP_HEADER_DEFAULT,
  ROUTE_FILE_EXTENSION_DEFAULT,
  SupportedHTTPHeaders,
} from "../constants.ts";
import { parseRawValue } from "../parse.ts";
import type { EntryDefinition, ShapeFor } from "../types.ts";

export function registerRoute<D extends EntryDefinition>(
  path: string,
  { registry = SYSTEM_REGISTRY, definition, render }: {
    registry?: BaseRegistry;
    definition?: D;
    // TODO(#): param-based caching option via @std/cache
    render: (
      params?: ShapeFor<D>,
      request?: Request,
    ) => Promise<CutoutGeneratorToken | string>;
  },
) {
  const sanitizedPath = _sanitizePath(path);

  const result = class implements Route {
    name = sanitizedPath;
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

      const renderResult = await render(params, request);

      let responseBody;
      if (typeof renderResult === "string") {
        responseBody = renderResult;
      } else {
        switch (this.#contentType) {
          case "text/html": // TODO(#): Inject importmaps, etc.
          default:
            responseBody = html(renderResult);
        }
      }

      return new Response(responseBody, {
        // TODO(#): Construct request-specific headers: CORS, CSP & Session Token
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

  registry.define(path, result);

  return Reflect.construct(result, []);
}

function _sanitizePath(rawRouteText: string): string {
  const pathSegments: string[] = [];

  for (let segment of rawRouteText.split(/\/+/)) {
    let isVariable = false, isOptional = false;

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
