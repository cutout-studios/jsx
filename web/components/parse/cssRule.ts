import { BinaryHeap } from "@std/data-structures";

type CSSParseResult = {
  selectors: string[];
  properties: Map<string, string>;
};

export function parseCSSRule(cssText: string): CSSParseResult | undefined {
  const ruleStructure = cssText.trim().match(
    /^(?<selectorText>.+){(?<propertyText>.+)}$/,
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
  const selectorRegex = /\S+,\s*/;
  let currentSelector = selectorRegex.exec(selectorText);
  while (currentSelector) {
    // NOTE: classes are case-sensitive
    selectors.push(currentSelector[0].trim());

    currentSelector = selectorRegex.exec(selectorText);
  }

  const properties = new BinaryHeap<[string, string]>(([key1, key2]) =>
    key1.localeCompare(key2)
  );
  const propertyRegex = /(?<propertyName>.*):(?<propertyValue>.*);/;
  let currentPropertySet = propertyRegex.exec(propertyText);
  while (currentPropertySet) {
    if (
      !currentPropertySet.groups?.propertyName ||
      !currentPropertySet.groups?.propertyValue
    ) {
      return;
    }

    const { propertyName, propertyValue } = currentPropertySet.groups;

    properties.push([propertyName.trim().toLowerCase(), propertyValue.trim()]);

    currentPropertySet = propertyRegex.exec(selectorText);
  }

  return {
    selectors: Array.from(selectors.drain()),
    properties: new Map(properties.drain()),
  };
}
