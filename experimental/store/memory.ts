import {
  type CutoutGeneratorToken,
  type CutoutPrimitiveToken,
  type CutoutSyntaxToken,
  CutoutTokenType,
} from "@cutout/jsx/tokens";
import type { Store } from "./types.ts";

export type MemoryStoreToken =
  | CutoutPrimitiveToken
  | CutoutSyntaxToken;

const ESCAPE_MAP = new Map([
  [",", "&#44;"],
  ['"', "&#34;"],
  [":", "&#58;"],
]);

const ESCAPE_REGEX = new RegExp(
  `[${Array.from(ESCAPE_MAP.keys()).join("")}]`,
  "g",
);

const UNESCAPE_MAP = new Map(
  ESCAPE_MAP.entries().map(([from, to]) => [to, from]),
);

export class MemoryStore
  implements Store<MemoryStoreToken, MemoryStoreToken, CutoutGeneratorToken> {
  #map: Map<string, string> = new Map();

  get(key: MemoryStoreToken[]): CutoutGeneratorToken {
    const raw = this.#map.get(this.#stringifyTokenList(key));
    const result = raw ? this.#parseTokenList(raw) : null;
    return [
      CutoutTokenType.GENERATOR,
      function* () {
        if (!result) return;

        for (const token of result) {
          yield token;
        }
      },
    ];
  }

  set(key: MemoryStoreToken[], value: MemoryStoreToken[]) {
    this.#map.set(
      this.#stringifyTokenList(key),
      this.#stringifyTokenList(value),
    );
  }

  has(key: MemoryStoreToken[]): boolean {
    return this.#map.has(this.#stringifyTokenList(key));
  }

  delete(key: MemoryStoreToken[]): boolean {
    return this.#map.delete(this.#stringifyTokenList(key));
  }

  #stringifyTokenList(path: MemoryStoreToken[]): string {
    return path.reduce(
      (result, [type, value]) =>
        result + `${String(type)}:"${this.#escape(String(value))}",`,
      "",
    );
  }

  #parseTokenList(path: string): MemoryStoreToken[] {
    const result = [];

    for (
      const { groups } of path.matchAll(
        /(?<type>.*):"(?<value>.*)",/g,
      )
    ) {
      if (!groups) continue;

      const value = this.#unescape(groups.value);
      const type = Number(groups.type);

      let token: MemoryStoreToken;
      switch (type) {
        case CutoutTokenType.NUMBER:
          token = [CutoutTokenType.NUMBER, Number(value)];
          break;
        case CutoutTokenType.SYMBOL:
          token = [CutoutTokenType.SYMBOL, Symbol.for(value)];
          break;
        default:
          token = [type, value];
          break;
      }

      result.push(token);
    }

    return result;
  }

  #escape(value: string): string {
    return value.replaceAll(
      ESCAPE_REGEX,
      (char) => ESCAPE_MAP.get(char) ?? "",
    );
  }

  #unescape(value: string): string {
    return value.replaceAll(
      /&#\d\d;/g,
      (code) => UNESCAPE_MAP.get(code) ?? "",
    );
  }
}
