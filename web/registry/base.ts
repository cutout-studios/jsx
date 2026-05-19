import { CutoutError, CutoutErrorCode } from "@cutout/web/errors";
import { DUPLICATE_ENTRY_GUIDANCE } from "./constants.ts";
import { isElementEntryConstructor } from "./guards.ts";
import type {
  ElementConstructor,
  EntryDefinition,
  EntryProxyConstructor,
  Registry as RegistryInterface,
  RouteProxyContructor,
  StyleProxyConstructor,
} from "./types.ts";

export class BaseRegistry implements RegistryInterface {
  #internalRegistry = new Map<string, EntryProxyConstructor>();
  #reverseRegistry = new WeakMap<EntryProxyConstructor, string>();
  #baseRegistry = globalThis.customElements;

  define(name: string, constructor: StyleProxyConstructor): void;
  define<D extends EntryDefinition>(
    name: string,
    constructor: ElementConstructor<D>,
  ): void;
  define<D extends EntryDefinition>(
    name: string,
    constructor: RouteProxyContructor<D>,
  ): void;
  define(
    name: string,
    constructor: EntryProxyConstructor,
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

  get<D extends EntryDefinition>(
    name: string,
  ): EntryProxyConstructor<D> | undefined {
    return this.#internalRegistry.get(name) as EntryProxyConstructor<D>;
  }

  getName(entry: EntryProxyConstructor): string | null {
    return this.#reverseRegistry.get(entry) ?? null;
  }

  // TODO(#): bucket by specificity. sort alphabetically in each bucket.
  // getRoutes(): Route[] {}
}
