import type { EmptyShape } from "@cutout/common";
import type { Definition, Element, Route, Style } from "../types.ts";

/**
 * Used by a `CutoutServer` to manage your components.
 * This interface intentionally mirrors the browser's CustomElementRegistry API for better
cross-compatibility.
 */
export interface Registry {
  /**
   * Registers a route component constructor under the specified name.
   */
  define<D extends Definition>(
    name: string,
    constructor: RouteProxyConstructor<D>,
  ): void;

  /**
   * Registers a style component constructor under the specified name.
   */
  define(name: string, constructor: StyleProxyConstructor): void;

  /**
   * Registers an element component constructor under the specified name.
   */
  define<D extends Definition>(
    name: string,
    constructor: ElementConstructor<D>,
  ): void;

  /**
   * Retrieves a registered component constructor by its name.
   */
  get<D extends Definition>(
    name: string,
  ): ComponentProxyConstructor<D> | undefined;

  /**
   * Retrieves the registered name for a given component constructor.
   */
  getName(entry: ComponentProxyConstructor): string | null;
}

/**
 * A JavaScript constructor representing a valid `@cutout/web` component.
 * They are "proxies" in the sense that they aren't meant to be used as valid constructors, mainly to satify browser APIs.
 */
export type ComponentProxyConstructor<
  D extends Definition = EmptyShape,
> =
  | RouteProxyConstructor<D>
  | StyleProxyConstructor
  | ElementConstructor<D>;

/**
 * Proxy constructor for `CutoutRoute` components.
 */
export type RouteProxyConstructor<D extends Definition> = {
  new (): Route<D>;
};

/**
 * Proxy constructor for `CutoutStyle` components.
 */
export type StyleProxyConstructor = {
  new (): Style;
};

/**
 * Constructor for `CutoutElement` components.
 * Note: This is *not* a proxy, it is a genuine constructor and can be passed directly to a `CustomElementRegistry`.
 */
export type ElementConstructor<D extends Definition> = {
  new (...args: unknown[]): Element<D>;
};
