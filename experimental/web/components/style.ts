import { type EmptyShape, V8CallSite } from "@cutout/internal";
import { CutoutError, CutoutErrorCode } from "@cutout/web/errors";
import { relative } from "@std/path";
import { createBrowserStyle } from "./browser/style.ts";
import { createEndpoint } from "./endpoint.ts";
import type { Endpoint, Style, StyleOptions } from "./types.ts";

export function createStyle(
  rawCSS: string,
  { root = Deno.cwd() }: StyleOptions = {}
): Style {
  const cleanCSS = _cleanRawCSSRule(rawCSS);
  const callSiteFilePath = V8CallSite.getParent()?.getFileName() ??
    undefined;
  const path = callSiteFilePath ? relative(root, callSiteFilePath) : undefined;

  let route: Endpoint<EmptyShape> | undefined;
  if (path) {
    route = createEndpoint(path.replace(/\.tsx?$/, ".css"), {
      render: () => Promise.resolve(cleanCSS),
    });
  }

  return createBrowserStyle(cleanCSS, { route });
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
