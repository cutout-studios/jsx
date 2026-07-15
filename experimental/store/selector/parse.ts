import {
  CutoutError,
  CutoutErrorCode,
  enumGuardFactory,
} from "@cutout/internal";

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

export const parse = (query: string): Selector[] => {
  if (query.includes(":")) {
    throw new CutoutError(CutoutErrorCode.OPERATION_UNSUPPORTED);
  }

  if (query.includes("@")) {
    throw new CutoutError(CutoutErrorCode.OPERATION_UNSUPPORTED);
  }

  let rawQuery;
  const listRegex = new RegExp(
    `([^${Combinator.LIST}]+)(?:${Combinator.LIST}|$)`,
    "g",
  );
  const selectors: Selector[] = [];
  while ((rawQuery = listRegex.exec(query)) !== null) {
    let rawSubquery;
    let root: Selector | undefined;
    let pointer: Selector | undefined;
    const selectorStatement = rawQuery[0].replaceAll(/\s+/g, " ");
    const combinatorRegex = new RegExp(
      `(?<subquery>(?:\\[[^\\]]*\\]|[^\\s>+~|])+)\\s?(?<combinator>\\+|>|~|\\|\\||\\s)?\\s?`,
      "g",
    );
    while (
      (rawSubquery = combinatorRegex.exec(selectorStatement)) !== null
    ) {
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
      throw new CutoutError(CutoutErrorCode.DATA_MALFORMED);
    }

    selectors.push(root);
  }

  return selectors;
};

const _isCombinator = enumGuardFactory(Combinator);
function _parseSubqueryMatch({ groups }: RegExpExecArray): Selector {
  if (!groups) {
    throw new CutoutError(CutoutErrorCode.DATA_MALFORMED);
  }

  const result: Partial<Selector> = {};
  const { combinator, subquery } = groups;

  const [tagMatch] = subquery.match(TAG_REGEX) ?? [];

  if (tagMatch) {
    result.tag = tagMatch;
  }

  const [, idMatch] = subquery.match(ID_REGEX) ?? [];

  if (idMatch) {
    result.id = idMatch;
  }

  const [, rawClassNames] = subquery.match(CLASS_REGEX) ?? [];

  if (rawClassNames) {
    result.classNames = new Set(rawClassNames.split(/\s+/));
  }

  const parsedAttribute = _parseAttribute(
    subquery.match(ATTRIBUTE_BLOCK_REGEX) ?? [],
  );

  if (parsedAttribute) {
    result.attribute = parsedAttribute;
  }

  if (!Object.keys(result).length) {
    throw new CutoutError(CutoutErrorCode.DATA_MALFORMED);
  }

  console.log({ combinator });

  if (_isCombinator(combinator)) {
    result.combinator = combinator;
  } else if (combinator) {
    throw new CutoutError(CutoutErrorCode.DATA_MALFORMED);
  }

  return result as Selector;
}

const _isAttributeOperator = enumGuardFactory(AttributeOperator);
function _parseAttribute(
  [rawAttributeText]: RegExpMatchArray | [],
): AttributeSelector | undefined {
  if (!rawAttributeText) return;

  const attributeMatch = rawAttributeText.match(ATTRIBUTE_SELECTOR_REGEX);

  if (!attributeMatch?.groups) return;

  const { key, value, operator, casing } = attributeMatch.groups;

  if (!key) return;

  const result: AttributeSelector = { key };

  if (value) {
    result.value = value.replace(/^["']|["']$/g, "");
  }

  if (casing) {
    result.caseSensitive = casing === "s";
  }

  if (_isAttributeOperator(operator)) {
    result.operator = operator;
  }

  return result;
}
