import "cssom";

export function createStylesheet(...rules: CSSRule[]) {
  const result = new CSSStyleSheet();

  for (const rule of rules) {
    result.insertRule(rule.cssText);
  }

  return result;
}
