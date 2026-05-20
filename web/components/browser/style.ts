import type { Style, StyleFactory } from "../types.ts";

export const registerBrowserStyle: StyleFactory = (
  cssText,
  { route, registry },
): Style => {
  const result = class extends CSSRule implements Style {
    name = cssText;
    route = route;
    constructor() {
      super();
      this.cssText = cssText;
    }
  };

  registry?.define(cssText, result);

  return Reflect.construct(result, []);
};
