import type { Style, StyleOptions } from "../types.ts";

export function registerBrowserStyle(
  cssText: string,
  { route, registry }: StyleOptions,
): Style {
  const result = class extends CSSRule implements Style {
    text = cssText;
    route = route;
    constructor() {
      super();
      this.cssText = cssText;
    }
  };

  registry?.define(cssText, result);

  return Reflect.construct(result, []);
}
