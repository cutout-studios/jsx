import type { StyleResource } from "../types.ts";

export function createStyle(cssText: string): StyleResource {
  const result = new CSSRule();

  result.cssText = cssText;

  return Object.assign(result, {
    location: new URL(
      `data:text/css,${encodeURIComponent(result.cssText)}`,
    ),
  });
}
