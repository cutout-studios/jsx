import "@cutout/polyfill";

export function createStyleRule
(cssText: string): CSSRule {
  const result = new CSSRule();

  result.cssText = cssText;

  return result;
}
