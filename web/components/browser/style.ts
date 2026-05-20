import type { Style, StyleOptions } from "../types.ts";

/**
 * Registers a CSSRule in the given browsers' component registry,
 * returning an instance of that rule which can be passed to an Element.
 *
 * Note that this is the browser-specific implementation of the Style factory,
 * but it's also called in {@link ../../style.ts}
 * in the serner by way of `@cutout/polyfill`.
 *
 * @param {string} rawCSS The text of the raw CSS rule to be registered. Must be unique after sanitization.
 * @param {StyleOptions} options Options for configuring the Style generation.
 * @returns {Style} A generated Style instance.
 */
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
