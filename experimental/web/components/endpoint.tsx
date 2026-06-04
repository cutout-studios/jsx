import { contentType, getCharset } from "@std/media-types";

import {
  ROUTE_CONTENT_TYPE_DEFAULT,
  ROUTE_CSP_HEADER_DEFAULT,
  ROUTE_FILE_EXTENSION_DEFAULT,
  SupportedHTTPHeaders,
} from "./constants.ts";
import type { Endpoint, OptionsFor, TypeDefinition } from "./types.ts";

/** @internal */
export function createEndpoint<const D extends TypeDefinition>(
  path: string,
  { type, render, projection, method }: OptionsFor<Endpoint<D>>,
): Endpoint<D> {
  const sanitizedPath = _sanitizePath(path);

  const result = class {
    projection = projection;
    name = path;
    path = sanitizedPath;
    method = method;
    type = type;
    router = Reflect.construct(
      class {
        render = () => <>TODO</>;
        name = "TODO";
        static = true;
        router = this;
      },
      [],
    );
    pattern = new URLPattern({ pathname: sanitizedPath });
    render = render;

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
