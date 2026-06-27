import { CutoutTokenType } from "@cutout/jsx/tokens";
import type { Store, ValidStoreToken } from "./types.ts";

export class MemoryStore implements Store {
  #map: Map<string, string> = new Map();

  get(key: ValidStoreToken[]): ValidStoreToken[] | undefined {
    const result = this.#map.get(this.#stringifyTokenList(key));

    if (!result) return;

    return this.#parseTokenList(result);
  }

  set(key: ValidStoreToken[], value: ValidStoreToken[]) {
    this.#map.set(
      this.#stringifyTokenList(key),
      this.#stringifyTokenList(value),
    );
  }

  has(key: ValidStoreToken[]): boolean {
    return this.#map.has(this.#stringifyTokenList(key));
  }

  delete(key: ValidStoreToken[]): boolean {
    return this.#map.delete(this.#stringifyTokenList(key));
  }

  #stringifyTokenList(path: ValidStoreToken[]): string {
    return path.reduce(
      (result, [type, value]) =>
        result + `${String(type)}:"${this.#escape(String(value))}",`,
      "",
    );
  }

  #parseTokenList(path: string): ValidStoreToken[] {
    const result = [];

    for (
      const { groups } of path.matchAll(
        /(?<type>.*):"(?<value>.*)",/g,
      )
    ) {
      if (!groups) continue;

      const value = this.#unescape(groups.value);
      const type = Number(groups.type);

      let token: ValidStoreToken;
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
      this.#escapeMapRegex,
      (char) => this.#escapeMap.get(char) ?? "",
    );
  }

  #escapeMap = new Map([
    [",", "&#44;"],
    ['"', "&#34;"],
    [":", "&#58;"],
  ]);

  #escapeMapRegex = new RegExp(
    `[${Array.from(this.#escapeMap.keys()).join("")}]`,
    "g",
  );

  #unescape(value: string): string {
    return value.replaceAll(
      /&#\d\d;/g,
      (code) => this.#unescapeMap.get(code) ?? "",
    );
  }

  #unescapeMap = new Map(
    this.#escapeMap.entries().map(([from, to]) => [to, from]),
  );
}
