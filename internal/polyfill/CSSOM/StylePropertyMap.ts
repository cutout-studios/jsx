import { _globalThis } from "../global.ts";

export class StylePropertyMap {
  get(property: string): string | undefined {
    return this.#properties.get(property)?.[0];
  }

  set(property: string, ...values: string[]) {
    this.#properties.set(property, values);
  }

  forEach(fn: (property: string, value: string) => void) {
    for (const [property, values] of this.#properties) {
      for (const value of values) {
        fn(property, value);
      }
    }
  }

  clear() {
    this.#properties.clear();
  }

  #properties = new Map<string, string[]>();
}

_globalThis.StylePropertyMap = StylePropertyMap;
