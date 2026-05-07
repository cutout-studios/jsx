import { getCallerLocation } from "../common.ts";
import type { StyleResource } from "../types.ts";

// TODO: style name?
export function createStyle(cssText: string): StyleResource {
  const result = new CSSRule();

  result.cssText = cssText;

  // TODO: location can likely be data url
  return Object.assign(result, { location: getCallerLocation()! });
}
