import { CutoutError } from "@cutout/web/errors";
import { SYSTEM_REGISTRY } from "./base.ts";
import type { StyleEntry } from "./types.ts";

const STRIP_WHITESPACE_EXCEPT_BETWEEN_QUOTES_REGEX =
  /[^\s"']+|\"([^\"]*)\"|'([^']*)'/g;

export function registerStyle(
  cssText: string,
  { registry = SYSTEM_REGISTRY } = {},
) {
  // TODO: alphabetize the keys
  const sanitizedCSSText =
    (cssText.match(STRIP_WHITESPACE_EXCEPT_BETWEEN_QUOTES_REGEX) ?? [cssText])
      .join("");
  const callSiteFilePath = CutoutError.getV8CallSiteParent()?.getFileName();

  let fileLocation: URL;

  if (callSiteFilePath) {
    fileLocation = new URL(`file://${callSiteFilePath}`);
  }

  return registry.define(
    sanitizedCSSText,
    class extends CSSRule implements StyleEntry {
      name = sanitizedCSSText;
      fileLocation = fileLocation;

      constructor() {
        super();
        this.cssText = this.render();
      }

      render() {
        return sanitizedCSSText;
      }
    },
  );
}
