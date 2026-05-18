import { CutoutError, CutoutErrorCode } from "@cutout/web/errors";
import { DUPLICATE_ENTRY_GUIDANCE } from "./constants.ts";
import { isElementEntryConstructor } from "./guards.ts";
import type {
  ElementEntryConstructor,
  EntryConstructor,
  EntryDefinition,
  Registry as RegistryInterface,
  RouteEntryConstructor,
  StyleEntryConstructor,
} from "./types.ts";

export class BaseRegistry implements RegistryInterface {
  #internalRegistry = new Map<string, EntryConstructor>();
  #reverseRegistry = new WeakMap<EntryConstructor, string>();
  #baseRegistry = globalThis.customElements;

  define(name: string, constructor: StyleEntryConstructor): void;
  define<D extends EntryDefinition>(
    name: string,
    constructor: ElementEntryConstructor<D>,
  ): void;
  define<D extends EntryDefinition>(
    name: string,
    constructor: RouteEntryConstructor<D>,
  ): void;
  define(
    name: string,
    constructor: EntryConstructor,
  ) {
    if (this.#internalRegistry.has(name)) {
      throw new CutoutError(CutoutErrorCode.OPERATION_READONLY, {
        context: { registry: this, name },
        guidance: DUPLICATE_ENTRY_GUIDANCE,
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

  // TODO(#): bucket by specificity. sort alphabetically in each bucket.
  // getRoutes(): Route[] {}
}

export const SYSTEM_REGISTRY = new BaseRegistry();
