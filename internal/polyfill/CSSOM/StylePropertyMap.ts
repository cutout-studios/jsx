import { _globalThis } from "../global.ts";

export class StylePropertyMap {
  clear() {
    this.#properties.clear();
  }
  get(property: string) {
    return this.#properties.get(property);
  }
  set(property: string, ...values: string[]) {
    this.#properties.set(property, values);
  };
  forEach(fn: (property: string, value: string) => void) {
    for (const [property, value] of this.#properties) {
      fn(property, value);
    }
  };

  #properties = new Map();
}

_globalThis.StylePropertyMap = StylePropertyMap;
