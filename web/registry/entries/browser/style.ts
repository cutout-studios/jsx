import type { StyleEntry, StyleEntryOptions } from "../../types.ts";

export function registerBrowserStyle(
  cssText: string,
  { route, registry }: StyleEntryOptions,
) {
  const result = class extends CSSRule implements StyleEntry {
    name = cssText;
    route = route;
    constructor() {
      super();
      this.cssText = cssText;
    }
  };

  registry?.define(cssText, result);

  return result;
}
