import { CutoutError } from "@cutout/web/errors";
import { relative } from "@std/path";
import { SYSTEM_REGISTRY } from "./base.ts";
import type { StyleEntry } from "./types.ts";

export function registerStyle(
  cssText: string,
  { registry = SYSTEM_REGISTRY, root = Deno.cwd() } = {},
) {
  const sanitizedCSSText = sanitizeCSSRuleText(cssText);
  const callSiteFilePath = CutoutError.getV8CallSiteParent()?.getFileName() ??
    undefined;
  const path = callSiteFilePath ? relative(root, callSiteFilePath) : undefined;

  return registry.define(
    sanitizedCSSText,
    class extends CSSRule implements StyleEntry {
      name = sanitizedCSSText;
      path = path;
      render = () => sanitizedCSSText;

      constructor() {
        super();
        this.cssText = this.render();
      }
    },
  );
}

const STRIP_WHITESPACE_EXCEPT_BETWEEN_QUOTES_REGEX =
  /[^\s"']+|\"([^\"]*)\"|'([^']*)'/g;

function sanitizeCSSRuleText(cssRuleText: string): string {
  const tokens =
    cssRuleText.match(STRIP_WHITESPACE_EXCEPT_BETWEEN_QUOTES_REGEX) ??
      [];
  const styleProperties = new Map<string, string>();

  let selectorText = "", propertyText = "", currentProperty: string | undefined;
  for (const token of tokens) {
    if (token === "{") {
      continue;
    }

    if (token === "}") {
      break;
    }

    if (token.endsWith(":")) {
      currentProperty = token;
      continue;
    }

    if (token.endsWith(";")) {
      if (currentProperty) {
        styleProperties.set(currentProperty, token);
      }
      currentProperty = undefined;
      continue;
    }

    selectorText += token;
  }

  const sortedPropertyKeys = [...styleProperties.keys()].sort();
  for (const key of sortedPropertyKeys) {
    propertyText += key + styleProperties.get(key);
  }

  return `${selectorText}{${propertyText}}`;
}
