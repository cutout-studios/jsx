import { SYSTEM_RESOURCE_REGISTRY } from "./registry.ts";

export function defineStyle(
  cssText: string,
  { registry = SYSTEM_RESOURCE_REGISTRY },
) {
  const result = new CSSRule();
  result.cssText = cssText;

  return registry.define(cssText, result);
}
