import type {
  AnyArray,
  AnyFunction,
  AnyShape,
  EmptyShape,
} from "@cutout/common";
import type { CutoutGeneratorToken } from "@cutout/jsx/tokens";
import type { Route } from "@std/http/route";

export type Entry<D extends EntryDefinition> =
  | StyleEntry
  | RouteEntry<D>
  | ElementEntry<D>;

export type DefinitionConstructor =
  | typeof Number
  | typeof String
  | typeof Boolean
  | typeof Symbol
  | typeof Function
  | typeof Array
  | typeof Object;

// TODO(#51): nested definitions
export type EntryDefinition = Readonly<Record<string, DefinitionConstructor>>;

export type EntryConstructor<
  D extends EntryDefinition = EmptyShape,
> =
  | StyleEntryConstructor
  | ElementEntryConstructor<D>
  | RouteEntryConstructor<D>;

export interface StyleEntry extends CSSRule {
  readonly name: string;
}

export type StyleEntryConstructor = {
  new (...args: unknown[]): StyleEntry;
};

export interface RouteEntry<D extends EntryDefinition> extends Route {
  readonly name: string;
  readonly definition?: D;
}

export type RouteEntryConstructor<D extends EntryDefinition> = {
  new (...args: unknown[]): RouteEntry<D>;
};

export type ShapeValueFor<C extends DefinitionConstructor> = C extends typeof Number
  ? number
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

export interface ElementEntry<D extends EntryDefinition> extends HTMLElement {
  readonly name: string;
  readonly render?: (attributes?: ShapeFor<D>) => CutoutGeneratorToken;
  readonly definition?: D;
}

export type ElementEntryConstructor<D extends EntryDefinition> = {
  new (...args: unknown[]): ElementEntry<D>;
};
