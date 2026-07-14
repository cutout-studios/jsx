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
  );
  const selectors: Selector[] = [];
  while ((rawQuery = listRegex.exec(query))) {
    let rawSubquery;
    let root: Selector | undefined;
    let pointer: Selector | undefined;
    const combinatorRegex = new RegExp(
      `(?<subquery>\\w+)(?<combinator>${
        Object.values(Combinator).join("|").replaceAll(" ", "\\s") // TODO: needs refinement
      }|$)`,
    );
    while (
      (rawSubquery = combinatorRegex.exec(rawQuery[0].replaceAll(/\s+/, " ")))
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
    throw new CutoutError(CutoutErrorCode.DATA_MALFORMED);
  }

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

  const result: AttributeSelector = {
    key,
    value,
    caseSensitive: casing === "s",
  };

  if (_isAttributeOperator(operator)) {
    result.operator = operator;
  }

  return result;
}
