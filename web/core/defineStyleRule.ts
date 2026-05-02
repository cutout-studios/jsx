// KISS for now.
export function defineStyleRule(cssText: string): CSSRule {
  const result = new CSSRule();

  result.cssText = cssText;

  return result;
}
