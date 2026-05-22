import type { EmptyShape } from "@cutout/internal";
import { CutoutError, CutoutErrorCode } from "@cutout/web/errors";
import { relative } from "@std/path";
import { registerBrowserStyle } from "./browser/style.ts";
import { V8CallSite } from "./callsite.ts";
import { parseCSSRule } from "./parse/cssRule.ts";
import { registerRoute } from "./route.ts";
import type { Route, Style, StyleOptions } from "./types.ts";

/**
 * Registers a Style in the given component registry.
 *
 * Also registers a route to the styles' file in V8 environments.
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
  const callSiteFilePath = V8CallSite.getParent()?.getFileName() ??
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

function _cleanRawCSSRule(rawCSSRule: string): string {
  const result = parseCSSRule(rawCSSRule);

  if (!result) {
    throw new CutoutError(CutoutErrorCode.DATA_CORRUPTED, {
      context: rawCSSRule
    });
  }

  return `${result.selectors.join()}{${
    result.properties.entries().reduce((string, [key, value]) =>
      `${string}${key}:${value};`, "")
  }}`;
}
