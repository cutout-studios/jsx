import { CutoutError, CutoutErrorCode } from "@cutout/web/errors";
import { isElementEntryConstructor } from "./guards.ts";
import type { EntryConstructor } from "./types.ts";

// TODO: parse "path specificity" and make a path trie
export class Registry {
  #internalRegistry = new Map<string, EntryConstructor>();
  #reverseRegistry = new WeakMap<EntryConstructor, string>();
  #baseRegistry = globalThis.customElements;

  define(
    name: string,
    constructor: EntryConstructor,
  ) {
    if (this.#internalRegistry.has(name)) {
      throw new CutoutError(CutoutErrorCode.OPERATION_READONLY, {
        context: { registry: this, name },
        guidance:
          "Check if this registry has the present name, before defining an entry.",
      });
    }

    this.#internalRegistry.set(name, constructor);
    this.#reverseRegistry.set(constructor, name);

    if (isElementEntryConstructor(constructor)) {
      this.#baseRegistry.define(name, constructor);
    }
  }

  get(name: string): EntryConstructor | undefined {
    return this.#internalRegistry.get(name) as EntryConstructor;
  }

  getName(entry: EntryConstructor): string | null {
    return this.#reverseRegistry.get(entry) ?? null;
  }
}

export const SYSTEM_REGISTRY = new Registry();
