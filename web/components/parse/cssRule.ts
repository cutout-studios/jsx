import { BinaryHeap } from "@std/data-structures";

// NOTE: While tested, this parser has not been vetted
// for complete thoroughness.
// It should be sufficient for draft purposes.

type CSSParseResult = {
  selectors: string[];
  properties: Map<string, string>;
};

const INVALID = undefined;
const SELECTOR_TERMINATORS = `,{`;
const PROPERTY_TERMINATORS = `:;}`;
const TERMINATORS = SELECTOR_TERMINATORS + PROPERTY_TERMINATORS + `()"'`;

// TODO(#65): Likely lives inside the polyfill.
export function parseCSSRule(cssText: string): CSSParseResult | undefined {
  const parse = _createCSSParseState();

  try {
    for (
      const match of _regexMatches(
        `[^${TERMINATORS}]*[${TERMINATORS}]`,
        cssText,
      )
    ) {
      parse.index += match.length;

      if (
        parse.phase === "selectors" && _hasSelectorTerminator(match) &&
        !parse.inside.parenthesis
      ) {
        parse.appendValue(_stripTerminator(match));
        parse.commitAsSelector();

        if (match.endsWith("{")) {
          parse.phase = "properties";
        }

        continue;
      }

      if (
        parse.phase === "properties" && !parse.inside.anything &&
        match.endsWith(":")
      ) {
        parse.setKey(_stripTerminator(match));
        continue;
      }

      if (
        parse.phase === "properties" && !parse.inside.anything &&
        match.endsWith(";")
      ) {
        parse.appendValue(_stripTerminator(match));
        parse.commitAsProperty();
        continue;
      }

      parse.inside.update(_getLastChar(match));
      parse.appendValue(match.trim());
    }
  } catch {
    return INVALID;
  }

  // There's leftover text that wasn't parsed
  if (parse.index < cssText.trim().length) return INVALID;

  return parse.result;
}

const _createCSSParseState = () => ({
  phase: "selectors",
  index: 0,
  current: {
    key: "",
    value: "",
  },
  inside: {
    singleQuote: false,
    doubleQuote: false,
    parenthesis: 0,
    get anything() {
      return this.singleQuote || this.doubleQuote || this.parenthesis > 0;
    },
    update(terminator: string) {
      switch (terminator) {
        case "(":
          this.parenthesis++;
          break;
        case ")":
          this.parenthesis--;
          break;
        case "'":
          this.singleQuote = !this.singleQuote;
          break;
        case '"':
          this.doubleQuote = !this.doubleQuote;
          break;
      }
    },
  },
  setKey(key: string) {
    if (this.current.key) {
      throw INVALID;
    }

    this.current.key = key;
  },
  appendValue(value: string) {
    this.current.value += value;
  },
  commitAsSelector() {
    if (!this.current.value) {
      throw INVALID;
    }

    const [, rawSelectorSublist] = this.current.value.match(/\((.*)\)/) ?? [];

    if (rawSelectorSublist) {
      this.current.value = this.current.value.replace(
        rawSelectorSublist,
        rawSelectorSublist.split(/,\s*/).sort().join(","),
      );
    }

    this._selectors.push(this.current.value);
    this.current.value = "";
  },
  commitAsProperty() {
    if (!this.current.key) {
      throw INVALID;
    }

    this._properties.push([this.current.key, this.current.value]);
    this.current.key = "";
    this.current.value = "";
  },

  _selectors: new BinaryHeap<string>((selector1, selector2) =>
    selector1.localeCompare(selector2)
  ),
  _properties: new BinaryHeap<[string, string]>(([key1], [key2]) =>
    key1.localeCompare(key2)
  ),
  get result() {
    return {
      selectors: Array.from(this._selectors.drain()),
      properties: new Map(this._properties.drain()),
    };
  },
});

function* _regexMatches(regexString: string, text: string) {
  const regex = new RegExp(regexString, "g");

  let match;
  while ((match = regex.exec(text)) !== null) {
    yield match[0];
  }
}

const _hasSelectorTerminator = (str: string) =>
  SELECTOR_TERMINATORS.includes(_getLastChar(str));

const _getLastChar = (str: string) => str.charAt(str.length - 1);
const _stripTerminator = (str: string) => str.slice(0, -1).trim();
