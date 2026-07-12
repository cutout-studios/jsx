import type { Combinator } from "./constants.ts";
import type { Selector } from "./types.ts";

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
  const listRegex = new RegExp("TODO");
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

const TAG_REGEX = /TODO/;
const ID_REGEX = /TODO/;
const CLASS_REGEX = /TODO/;
const ATTRIBUTE_REGEX = /TODO/;

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
    // TODO
  }

  const [rawAttributeText] = subquery.match(ATTRIBUTE_REGEX) ?? [];

  if (rawAttributeText) {
    // TODO
  }

  if (!Object.keys(result).length) {
    throw new Error("TODO");
  }

  if (isCombinator(combinator)) {
    result.combinator = combinator;
  } else if (combinator) {
    throw new Error("TODO");
  }

  return result as Selector;
}

// TODO
function isCombinator(value: unknown): value is Combinator {
  return true;
}
