import { CutoutError } from "@cutout/web/errors";
import { relative } from "@std/path";
import { SYSTEM_REGISTRY } from "../base.ts";
import type { StyleEntry } from "../types.ts";
import { registerRoute } from "./route.ts";

export function registerStyle(
  rawCSS: string,
  { registry = SYSTEM_REGISTRY, root = Deno.cwd() } = {},
) {
  const cleanCSS = cleanRawCSSRule(rawCSS);
  const callSiteFilePath = CutoutError.getV8CallSiteParent()?.getFileName() ??
    undefined;
  const path = callSiteFilePath ? relative(root, callSiteFilePath) : undefined;

  if (path) {
    registerRoute(path.replace(/\.tsx?$/, ".css"), {
      render: () => Promise.resolve(cleanCSS),
    });
  }

  registry.define(
    cleanCSS,
    class extends CSSRule implements StyleEntry {
      name = cleanCSS;
      constructor() {
        super();
        this.cssText = cleanCSS;
      }
    },
  );
}

const STRIP_WHITESPACE_EXCEPT_BETWEEN_QUOTES_REGEX =
  /[^\s"']+|\"([^\"]*)\"|'([^']*)'/g;

function cleanRawCSSRule(rawCSSRule: string): string {
  const tokens =
    rawCSSRule.match(STRIP_WHITESPACE_EXCEPT_BETWEEN_QUOTES_REGEX) ??
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
