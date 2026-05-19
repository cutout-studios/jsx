import type {
  AnyArray,
  AnyFunction,
  AnyShape,
  EmptyShape,
} from "@cutout/common";
import type { CutoutGeneratorToken } from "@cutout/jsx/tokens";
import type { Route } from "@std/http/route";

// Registry
export interface Registry {
  define<D extends EntryDefinition>(
    name: string,
    constructor: RouteProxyContructor<D>,
  ): void;
  define(name: string, constructor: StyleProxyConstructor): void;
  define<D extends EntryDefinition>(
    name: string,
    constructor: ElementConstructor<D>,
  ): void;
  get<D extends EntryDefinition>(
    name: string,
  ): EntryProxyConstructor<D> | undefined;
  getName(entry: EntryProxyConstructor): string | null;
}

// Registry entries
export type EntryProxyConstructor<
  D extends EntryDefinition = EmptyShape,
> =
  | RouteProxyContructor<D>
  | StyleProxyConstructor
  | ElementConstructor<D>;

// TODO(#51): nested definitions
export type EntryDefinition = Readonly<
  Record<PropertyKey, ValidDefinitionConstructor>
>;

// Registry entry type - Routes
export type RouteProxyContructor<D extends EntryDefinition> = {
  new (): RouteEntry<D>;
};

export interface RouteEntry<D extends EntryDefinition> extends Route {
  readonly name: string;
  readonly definition?: D;
  readonly render?: RouteRenderer<D>;
}

export type RouteRenderer<D extends EntryDefinition> = (
  parameters: ShapeFor<D>,
  request?: Request,
) => Promise<CutoutGeneratorToken | string>;

// Registry entry type - Styles
export type StyleProxyConstructor = {
  new (): StyleEntry;
};

export interface StyleEntry extends CSSRule {
  readonly name: string;
  readonly route?: RouteEntry<EmptyShape>;
}

// Registry entry type - Elements
export type ElementConstructor<D extends EntryDefinition> = {
  new (...args: unknown[]): ElementEntry<D>;
};

export interface ElementEntry<D extends EntryDefinition> extends HTMLElement {
  readonly name: string;
  readonly definition?: D;
  readonly render?: ElementRenderer<D>;
}

export type ElementRenderer<D extends EntryDefinition> = (
  attributes: ShapeFor<D>,
) => CutoutGeneratorToken;

// Helper Types
export type ValidDefinitionConstructor =
  | typeof Number
  | typeof String
  | typeof Boolean
  | typeof Symbol
  | typeof Function
  | typeof Array
  | typeof Object;

export type ShapeValueFor<C extends ValidDefinitionConstructor> = C extends
  typeof Number ? number
  : C extends typeof BigInt ? bigint
  : C extends typeof String ? string
  : C extends typeof Boolean ? boolean
  : C extends typeof Symbol ? symbol
  : C extends typeof Function ? AnyFunction
  : C extends typeof Array ? AnyArray
  : C extends typeof Object ? AnyShape
  : never;

export type ShapeFor<T extends EntryDefinition> = {
  [K in keyof T]?: ShapeValueFor<T[K]>;
};
