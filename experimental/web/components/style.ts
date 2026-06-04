import { CutoutError, CutoutErrorCode } from "@cutout/web/errors";
import { createBrowserStyle } from "./browser/style.ts";
import type { Style } from "./types.ts";

export function createStyle(rawCSS: string): Style {
  const cleanCSS = _cleanRawCSSRule(rawCSS);

  return createBrowserStyle(cleanCSS, {});
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
