import { BinaryHeap } from "@std/data-structures";

type CSSParseResult = {
  selectors: string[];
  properties: Map<string, string>;
};

export function parseCSSRule(cssText: string): CSSParseResult | undefined {
  const ruleStructure = cssText.match(
    /(?<selectorText>[^]+){(?<propertyText>[^]+)}/,
  );

  if (!ruleStructure || !ruleStructure.groups) {
    return;
  }

  const { groups } = ruleStructure;

  if (!groups.selectorText || !groups.propertyText) {
    return;
  }

  const { selectorText, propertyText } = groups;

  const selectors = new BinaryHeap<string>((selector1, selector2) =>
    selector1.localeCompare(selector2)
  );

  // NOTE: the global 'g' flag is required to avoid infinite loops, here.
  const selectorRegex = /\s*([^,]+),?/g;
  let [, currentSelector] = selectorRegex.exec(selectorText) ?? [];
  while (typeof currentSelector !== "undefined") {
    // NOTE: selectors are case-sensitive
    // TODO: avoid the `trim` call
    selectors.push(currentSelector.trim());

    [, currentSelector] = selectorRegex.exec(selectorText) ?? [];
  }

  const properties = new BinaryHeap<[string, string]>(([key1], [key2]) => 
    key1.localeCompare(key2)
  );
  const propertyRegex = /\s*(?<propertyName>.*):\s*(?<propertyValue>.*);/g;
  let currentPropertySet = propertyRegex.exec(propertyText);
  while (currentPropertySet) {
    if (!currentPropertySet.groups) {
      return;
    }

    const { propertyName, propertyValue } = currentPropertySet.groups;

    properties.push([propertyName.toLowerCase(), propertyValue]);

    currentPropertySet = propertyRegex.exec(propertyText);
  }

  return {
    selectors: Array.from(selectors.drain()),
    properties: new Map(properties.drain()),
  };
}
