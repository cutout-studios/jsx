import { type EmptyShape, V8CallSite } from "@cutout/internal";
import { CutoutError, CutoutErrorCode } from "@cutout/web/errors";
import { relative } from "@std/path";
import { registerBrowserStyle } from "./browser/style.ts";
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
  // TODO(?): This may be invalid on the FE, we have to use document.createElement, etc.
  // Rather than construct directly.
  const result = new CSSStyleRule();

  try {
    result.cssText = rawCSSRule;
  } catch (cause) {
    throw new CutoutError(CutoutErrorCode.DATA_CORRUPTED, {
      context: rawCSSRule,
      cause,
    });
  }

  let properties = "";

  result.styleMap.forEach((key, value) => properties += `${key}:${value};`);

  return `${result.selectorText}{${properties}}`;
}
