import type { EmptyShape } from "@cutout/common";
import { CutoutError } from "@cutout/web/errors";
import { relative } from "@std/path";
import { registerBrowserStyle } from "./browser/style.ts";
import { registerRoute } from "./route.ts";
import type { Route, Style, StyleOptions } from "./types.ts";

/**
 * Registers a Style in the given component registry.
 *
 * @param {string} rawCSS The text of the raw CSS rule to be registered. Must be unique after sanitization.
 * @param {StyleOptions} options Options for configuring the Style generation.
 * @returns {Style} A generated Style instance.
 */
export function registerStyle(
  rawCSS: string,
  { registry, root = Deno.cwd() }: StyleOptions,
): Style {
  const cleanCSS = _cleanRawCSSRule(rawCSS);
  const callSiteFilePath = CutoutError.getV8CallSiteParent()?.getFileName() ??
    undefined;
  const path = callSiteFilePath ? relative(root, callSiteFilePath) : undefined;

  let route: Route<EmptyShape> | undefined;
  if (path) {
    route = registerRoute(path.replace(/\.tsx?$/, ".css"), {
      registry,
      render: () => Promise.resolve(cleanCSS),
    });
  }

  return registerBrowserStyle(cleanCSS, { route, registry });
}

// TODO(#): better CSS parsing - this currently only works in limited cases
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
