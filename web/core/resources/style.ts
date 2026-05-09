export function createStyle(cssText: string): CSSRule {
  const result = new CSSRule();

  result.cssText = cssText;

  return result
}
