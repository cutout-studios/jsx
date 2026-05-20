import { CutoutError, CutoutErrorCode } from "@cutout/web/errors";
import { DUPLICATE_ENTRY_GUIDANCE } from "../constants.ts";
import type { Definition } from "../types.ts";
import { isElementEntryConstructor } from "./guards.ts";
import type {
  ComponentProxyConstructor,
  ElementConstructor,
  Registry,
  RouteProxyConstructor,
  StyleProxyConstructor,
} from "./types.ts";

/** See {@link Registry} */
export class BaseRegistry implements Registry {
  #internalRegistry = new Map<string, ComponentProxyConstructor>();
  #reverseRegistry = new WeakMap<ComponentProxyConstructor, string>();
  #baseRegistry = globalThis.customElements;

  /** See {@link Registry.define} */
  define(name: string, constructor: StyleProxyConstructor): void;

  /** See {@link Registry.define} */
  define<D extends Definition>(
    name: string,
    constructor: ElementConstructor<D>,
  ): void;

  /** See {@link Registry.define} */
  define<D extends Definition>(
    name: string,
    constructor: RouteProxyConstructor<D>,
  ): void;

  /** See {@link Registry.define} */
  define(
    name: string,
    constructor: ComponentProxyConstructor,
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

  /** See {@link Registry.get} */
  get<D extends Definition>(
    name: string,
  ): ComponentProxyConstructor<D> | undefined {
    return this.#internalRegistry.get(name) as ComponentProxyConstructor<D>;
  }

  /** See {@link Registry.getName} */
  getName(entry: ComponentProxyConstructor): string | null {
    return this.#reverseRegistry.get(entry) ?? null;
  }

  // TODO(@cutout/web/server): bucket by specificity. sort alphabetically in each bucket.
  // getRoutes(): Route[] {}
}
