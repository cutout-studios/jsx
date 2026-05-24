import { BinaryHeap } from "@std/data-structures";

type CSSParseResult = {
  selectors: string[];
  properties: Map<string, string>;
};

// TODO: Let's make this more scanner-style; this is getting a bit too complicated.
// TODO(#): likely belongs in the polyfill; and is really CSSStyleRule only atm.
export function parseCSSRule(cssText: string): CSSParseResult | undefined {
  const selectorSectionRegex = /(?<selectorText>[^{}]+)\s*{/;
  const propertySectionRegex = /(?<propertyText>[\s\S]*?)\s*}\s*$/;

  const _selectorMatch = cssText.match(selectorSectionRegex);
  const _propertyMatch = cssText.slice(
    (_selectorMatch?.index ?? 0) + (_selectorMatch?.[0]?.length ?? 0),
  ).match(propertySectionRegex);

  const rawSelectors = _selectorMatch?.groups?.selectorText.trim();
  const rawProperties = _propertyMatch?.groups?.propertyText.trim();

  if (!rawSelectors || !rawProperties) {
    return;
  }

  const selectors = new BinaryHeap<string>((selector1, selector2) =>
    selector1.localeCompare(selector2)
  );

  // NOTE: the global 'g' flag is required to avoid infinite loops, here.
  const selectorRegex = /\s*([^,]+),?/g;
  let [, currentSelector] = selectorRegex.exec(rawSelectors) ?? [];
  while (typeof currentSelector !== "undefined") {
    // NOTE: selectors are case-sensitive
    selectors.push(currentSelector.trim());

    [, currentSelector] = selectorRegex.exec(rawSelectors) ?? [];
  }

  const properties = new BinaryHeap<[string, string]>(([key1], [key2]) =>
    key1.localeCompare(key2)
  );
  const propertyRegex = /\s*(?<propertyName>[a-zA-Z_-]+):\s*(?<propertyValue>.*);/g;
  let currentPropertySet = propertyRegex.exec(rawProperties);
  while (currentPropertySet) {
    if (!currentPropertySet.groups) {
      return;
    }

    const { propertyName, propertyValue } = currentPropertySet.groups;

    if (typeof propertyName !== "string" || typeof propertyValue !== "string") {
      return;
    }

    properties.push([propertyName.toLowerCase(), propertyValue]);

    currentPropertySet = propertyRegex.exec(rawProperties);
  }

  return {
    selectors: Array.from(selectors.drain()),
    properties: new Map(properties.drain()),
  };
}
