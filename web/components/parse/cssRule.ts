import { BinaryHeap } from "@std/data-structures";

type CSSParseResult = {
  selectors: string[];
  properties: Map<string, string>;
};

const INVALID = undefined;
const SPECIAL_CHARACTERS = `(){},:;'"`;

export function parseCSSRule(cssText: string): CSSParseResult | undefined {
  const state = _createCSSParseState(cssText);

  while (state.next()) {
    if (
      state.phase === "selectors" && state.hasSelectorTerminator
    ) {
      state.append(state.tokenFragment);
      state.commitSelector();
      continue;
    }

    if (
      state.phase === "properties" && !state.inside.any &&
      state.token.endsWith(":")
    ) {
      state.appendKey(state.tokenFragment);
    } else if (
      state.phase === "properties" && !state.inside.any &&
      state.token.endsWith(";")
    ) {
      state.append(state.tokenFragment);
      state.commitProperty();
      continue;
    }

    state.append(state.token);
  }

  // There's leftover text that wasn't parsed
  if (state.index < cssText.trim().length) return INVALID;

  return state.result;
}

const _createCSSParseState = (cssText: string) => ({
  phase: "selectors",
  index: 0,
  token: "",
  key: "",
  value: "",
  get hasSelectorTerminator() {
    return this.token.endsWith("{") || (
      this.token.endsWith(",") && !this.inside.parenthesis
    );
  },
  selectors: new BinaryHeap<string>((selector1, selector2) =>
    selector1.localeCompare(selector2)
  ),
  properties: new BinaryHeap<[string, string]>(([key1], [key2]) =>
    key1.localeCompare(key2)
  ),
  inside: {
    singleQuote: false,
    doubleQuote: false,
    parenthesis: 0,
    get any() {
      return this.singleQuote || this.doubleQuote || this.parenthesis > 0;
    },
  },
  get result() {
    return {
      selectors: Array.from(this.selectors.drain()),
      properties: new Map(this.properties.drain()),
    };
  },
  get tokenFragment() {
    return this.token.slice(0, -1).trim();
  },
  append(value: string) {
    this.value += value;
  },
  appendKey(key: string) {
    if (this.key) {
      throw INVALID;
    }

    this.key = key;
  },
  next() {
    switch (this.token.charAt(-1)) {
      case "(":
        this.inside.parenthesis++;
        break;
      case ")":
        this.inside.parenthesis--;
        break;
      case '"':
        this.inside.doubleQuote = !this.inside.doubleQuote;
        break;
      case "'":
        this.inside.singleQuote = !this.inside.singleQuote;
        break;
    }

    const _match = this._regex.exec(cssText);

    if (!_match) return;

    const [raw] = _match;

    this.token = raw.trim();
    this.index = _match.index + raw.length;

    return this.token;
  },
  // TODO: extract csvs btwn parens and sort
  commitSelector() {
    if (this.token.endsWith("{")) {
      this.phase = "properties";
    }

    if (!this.value) {
      throw INVALID;
    }

    this.selectors.push(this.value);
    this.value = "";
  },
  commitProperty() {
    if (!this.key || !this.value) {
      throw INVALID;
    }

    this.properties.push([this.key, this.value]);
    this.key = "";
    this.value = "";
  },
  _regex: new RegExp(`[^${SPECIAL_CHARACTERS}]*[${SPECIAL_CHARACTERS}]`, "g"),
});
