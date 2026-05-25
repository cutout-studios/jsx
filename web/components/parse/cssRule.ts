import { BinaryHeap } from "@std/data-structures";

type CSSParseResult = {
  selectors: string[];
  properties: Map<string, string>;
};

const SPECIAL_CHARACTERS = `(){},:;'"`;

export function parseCSSRule(cssText: string): CSSParseResult | undefined {
  const nextChunk = new RegExp(
    `[^${SPECIAL_CHARACTERS}]*[${SPECIAL_CHARACTERS}]`,
    "g",
  );
  const selectors = new BinaryHeap<string>((selector1, selector2) =>
    selector1.localeCompare(selector2)
  );
  const properties = new BinaryHeap<[string, string]>(([key1], [key2]) =>
    key1.localeCompare(key2)
  );

  let phase = "selectors";
  let [currentToken, currentKey] = ["", ""];
  let currentChunk;
  let [insideSingleQuote, insideDoubleQuote, insideParenthesis] = [
    false,
    false,
    0,
  ];
  while ((currentChunk = nextChunk.exec(cssText)) !== null) {
    const tokenFragment = currentChunk[0].trim();

    if (phase === "selectors") {
      if (tokenFragment.endsWith("{")) {
        currentToken += tokenFragment.slice(0, tokenFragment.length - 1).trim();
        selectors.push(currentToken);
        currentToken = "";
        phase = "properties";
        continue;
      } else if (tokenFragment.endsWith(",") && !insideParenthesis) {
        currentToken += tokenFragment.slice(0, tokenFragment.length - 1).trim();
        selectors.push(currentToken);
        currentToken = "";
      } else {
        if (tokenFragment.endsWith("(")) {
          insideParenthesis++;
        }

        if (tokenFragment.endsWith(")")) {
          insideParenthesis--;
        }

        currentToken += tokenFragment;
      }
    }

    if (phase === "properties") {
      if (
        tokenFragment.endsWith(":") && !insideDoubleQuote &&
        !insideSingleQuote && !insideParenthesis
      ) {
        if (currentKey) return;

        currentKey = tokenFragment.slice(0, tokenFragment.length - 1).trim();
      } else if (
        tokenFragment.endsWith(";") && !insideDoubleQuote &&
        !insideSingleQuote && !insideParenthesis
      ) {
        currentToken += tokenFragment.slice(0, tokenFragment.length - 1).trim();
        properties.push([currentKey, currentToken]);
        [currentKey, currentToken] = ["", ""];
      } else if (
        tokenFragment.endsWith("}") && !insideDoubleQuote && !insideSingleQuote
      ) {
        phase = "end";
        continue;
      } else {
        if (tokenFragment.endsWith("(")) {
          insideParenthesis++;
        }

        if (tokenFragment.endsWith(")")) {
          insideParenthesis--;
        }

        if (tokenFragment.endsWith('"')) {
          insideDoubleQuote = !insideDoubleQuote;
        }

        if (tokenFragment.endsWith("'")) {
          insideSingleQuote = !insideSingleQuote;
        }

        currentToken += tokenFragment;
      }
    }

    if (phase === "end") {
      return;
    }
  }

  return {
    selectors: Array.from(selectors.drain()),
    properties: new Map(properties.drain()),
  };
}
