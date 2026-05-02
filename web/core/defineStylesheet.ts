// KISS for now.
export function defineStylesheet(...rules: CSSRule[]) {
  const result = new CSSStyleSheet();

  for (const rule of rules) {
    result.insertRule(rule.cssText);
  }

  return result;
}
