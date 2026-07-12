import {
  ATTRIBUTE_BLOCK_REGEX,
  ATTRIBUTE_SELECTOR_REGEX,
  AttributeOperator,
  CLASS_REGEX,
  Combinator,
  ID_REGEX,
  TAG_REGEX,
} from "./constants.ts";
import type { AttributeSelector, Selector } from "./types.ts";

// TODO: CutoutError? :(
export const parse = (query: string): Selector[] => {
  if (query.includes(":")) {
    throw new Error(
      "TODO(error message text): psuedo/relative selectors are are either unsupproted or not relevant.",
    );
  }

  if (query.includes("@")) {
    throw new Error(
      "TODO(error message text): at rules (media queries, et al) are either not supported or not relevant.",
    );
  }

  let rawQuery;
  const listRegex = new RegExp(
    `([^${Combinator.LIST}]+)(?:${Combinator.LIST}|$)`,
  );
  const selectors: Selector[] = [];
  while ((rawQuery = listRegex.exec(query))) {
    let rawSubquery;
    let root: Selector | undefined;
    let pointer: Selector | undefined;
    const combinatorRegex = new RegExp("TODO");
    while ((rawSubquery = combinatorRegex.exec(rawQuery[0]))) {
      const result = _parseSubqueryMatch(rawSubquery);

      if (!root && !pointer) {
        root = result;
        pointer = root;
      } else {
        pointer!.child = result;
        pointer = pointer!.child;
      }
    }

    if (!root) {
      throw new Error("TODO");
    }

    selectors.push(root);
  }

  return selectors;
};

function _parseSubqueryMatch({ groups }: RegExpExecArray): Selector {
  if (!groups) {
    throw new Error("TODO");
  }

  const result: Partial<Selector> = {};
  const { combinator, subquery } = groups;

  [result.tag] = subquery.match(TAG_REGEX) ?? [];
  [result.id] = subquery.match(ID_REGEX) ?? [];

  const [rawClassNames] = subquery.match(CLASS_REGEX) ?? [];

  if (rawClassNames) {
    result.classNames = new Set(rawClassNames.split(/\s+/));
  }

  result.attribute = _parseAttribute(
    subquery.match(ATTRIBUTE_BLOCK_REGEX) ?? [],
  );

  if (!Object.keys(result).length) {
    throw new Error("TODO");
  }

  if (_isCombinator(combinator)) {
    result.combinator = combinator;
  } else if (combinator) {
    throw new Error("TODO");
  }

  return result as Selector;
}

function _parseAttribute(
  [rawAttributeText]: RegExpMatchArray | [],
): AttributeSelector | undefined {
  if (!rawAttributeText) return;

  const attributeMatch = rawAttributeText.match(ATTRIBUTE_SELECTOR_REGEX);

  if (!attributeMatch?.groups) return;

  const { key, value, operator } = attributeMatch.groups;

  if (!key) return;

  const result: AttributeSelector = { key, value };

  if (_isAttributeOperator(operator)) {
    result.operator = operator;
  }

  return result;
}

// TODO: generic enum guard?
function _isCombinator(value: unknown): value is Combinator {
  if (typeof value !== "string") {
    return false;
  }

  for (const combinatorValue of Object.values(Combinator)) {
    if (value === combinatorValue) {
      return true;
    }
  }

  return false;
}

function _isAttributeOperator(value: unknown): value is AttributeOperator {
  if (typeof value !== "string") {
    return false;
  }

  for (const operatorValue of Object.values(AttributeOperator)) {
    if (value === operatorValue) {
      return true;
    }
  }

  return true;
}
