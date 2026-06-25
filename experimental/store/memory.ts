import { CutoutTokenType } from "@cutout/jsx/tokens";
import { Store, ValidStoreToken } from "./types.ts";

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
        result + `${type}:"${this.#escape(String(value))}";`,
      "",
    );
  }

  #parseTokenList(path: string): ValidStoreToken[] {
    const result = [];

    for (
      const { groups } of path.matchAll(
        /(?:<type>):"(?:<value>)";/,
      )
    ) {
      let { type, value } = groups!;
      value = this.#unescape(value);

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

  // TODO: escape/unescape
  #escape(value: string): string {
    return value;
  }

  #unescape(value: string): string {
    return value;
  }
}
