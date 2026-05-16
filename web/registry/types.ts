import type { AnyArray, AnyFunction, AnyShape } from "@cutout/common";
import type { CutoutGeneratorToken } from "@cutout/jsx/tokens";

export type Entry<D extends EntryDefinition> =
  | StyleEntry
  | RouteEntry<D>
  | ElementEntry<D>;

export type EntryDefinition = Record<string, DefinitionConstructor>;

export type EntryConstructor<
  D extends EntryDefinition = EmptyShape,
> =
  | StyleEntryConstructor
  | ElementEntryConstructor<D>
  | RouteEntryConstructor<D>;

export interface StyleEntry extends CSSRule {
  name: string;
  fileLocation?: URL;
  render: () => string;
}

export type StyleEntryConstructor = {
  new (...args: unknown[]): StyleEntry;
};

export interface RouteEntry<D extends EntryDefinition> {
  name: string;
  definition?: D;
  fileLocation?: URL;
  render: (parameters: ShapeFor<D>) => Response;
}

export type RouteEntryConstructor<D extends EntryDefinition> = {
  new (...args: unknown[]): RouteEntry<D>;
};

export interface ElementEntry<D extends EntryDefinition> extends HTMLElement {
  name: string;
  definition?: D;
  fileLocation?: URL;
  render: (attributes: ShapeFor<D>) => CutoutGeneratorToken;
}

export type ElementEntryConstructor<D extends EntryDefinition> = {
  new (...args: unknown[]): ElementEntry<D>;
};

// ...

type EmptyShape = Record<PropertyKey, never>;

// TODO(#51): nested attribute definitions
type DefinitionConstructor =
  | typeof Number
  | typeof String
  | typeof Boolean
  | typeof Symbol
  | typeof Function
  | typeof Array
  | typeof Object;

type ShapeValueFor<C extends DefinitionConstructor> = C extends typeof Number
  ? number
  : C extends typeof BigInt ? bigint
  : C extends typeof String ? string
  : C extends typeof Boolean ? boolean
  : C extends typeof Symbol ? symbol
  : C extends typeof Function ? AnyFunction
  : C extends typeof Array ? AnyArray
  : C extends typeof Object ? AnyShape
  : never;

type ShapeFor<T extends EntryDefinition> = {
  [K in keyof T]?: ShapeValueFor<T[K]>;
};
