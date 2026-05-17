import type { Route } from "@std/http/route";
import { contentType, getCharset } from "@std/media-types";

import { type Registry, SYSTEM_REGISTRY } from "./base.ts";
import type { EntryDefinition, ShapeFor } from "./types.ts";

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
      #extension = ".txt"; // TODO: parse from path
      #contentType = contentType(this.#extension) ?? "text/plain";
      #headers = {
        "content-type": `charset=${getCharset(this.#contentType)}; ${this.#contentType}`,
        // TODO: CORS, CSP
      };
      // TODO: Session Token?
      // TODO: priority stack for each url pattern location
      handler = (request: Request, { pathname }: URLPatternResult) => {
        const params: ShapeFor<D> = {};

        for (const key in definition) {
          if (!(key in pathname.groups)) {
            continue;
          }

          // TODO: I think i solved this in the exploration branch
          params[key] = definition[key](pathname.groups[key]);
        }

        const responseBody = render(params, request);

        return new Response(responseBody, {
          "headers": this.#headers,
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
