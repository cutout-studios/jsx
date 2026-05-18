import type { EmptyShape } from "@cutout/common";
import { CutoutError } from "@cutout/web/errors";
import { relative } from "@std/path";
import { SYSTEM_REGISTRY } from "../base.ts";
import type { RouteEntry } from "../types.ts";
import { registerBrowserStyle } from "./browser/style.ts";
import { registerRoute } from "./route.ts";

export function registerStyle(
  rawCSS: string,
  { registry = SYSTEM_REGISTRY, root = Deno.cwd() } = {},
) {
  const cleanCSS = _cleanRawCSSRule(rawCSS);
  const callSiteFilePath = CutoutError.getV8CallSiteParent()?.getFileName() ??
    undefined;
  const path = callSiteFilePath ? relative(root, callSiteFilePath) : undefined;

  let route: RouteEntry<EmptyShape> | undefined;
  if (path) {
    route = registerRoute(path.replace(/\.tsx?$/, ".css"), {
      render: () => Promise.resolve(cleanCSS),
    });
  }

  const result = registerBrowserStyle(cleanCSS, { route, registry });

  return Reflect.construct(result, []);
}

const STRIP_WHITESPACE_EXCEPT_BETWEEN_QUOTES_REGEX =
  /[^\s"']+|\"([^\"]*)\"|'([^']*)'/g;

function _cleanRawCSSRule(rawCSSRule: string): string {
  const tokens =
    rawCSSRule.match(STRIP_WHITESPACE_EXCEPT_BETWEEN_QUOTES_REGEX) ??
      [];
  const styleProperties = new Map<string, string>();

  let selectorText = "", propertyText = "", currentProperty: string | undefined;
  for (const token of tokens) {
    if (token === "{") {
      continue;
    }

    if (token === "}") {
      break;
    }

    if (token.endsWith(":")) {
      currentProperty = token;
      continue;
    }

    if (token.endsWith(";")) {
      if (currentProperty) {
        styleProperties.set(currentProperty, token);
      }
      currentProperty = undefined;
      continue;
    }

    selectorText += token;
  }

  const sortedPropertyKeys = [...styleProperties.keys()].sort();
  for (const key of sortedPropertyKeys) {
    propertyText += key + styleProperties.get(key);
  }

  return `${selectorText}{${propertyText}}`;
}
