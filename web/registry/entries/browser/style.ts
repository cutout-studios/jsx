import type { StyleEntry } from "../../types.ts";
import type { StyleEntryFactory } from "../types.ts";

export const registerBrowserStyle: StyleEntryFactory = (
  cssText,
  { route, registry },
) => {
  const result = class extends CSSRule implements StyleEntry {
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
