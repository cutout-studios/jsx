import type {
  AnyArray,
  AnyFunction,
  AnyShape,
  EmptyShape,
} from "@cutout/common";
import type { CutoutGeneratorToken } from "@cutout/jsx/tokens";
import type { Route } from "@std/http/route";

export interface Registry {
  define(name: string, constructor: StyleEntryConstructor): void;
  define<D extends EntryDefinition>(
    name: string,
    constructor: ElementEntryConstructor<D>,
  ): void;
  define<D extends EntryDefinition>(
    name: string,
    constructor: RouteEntryConstructor<D>,
  ): void;
  get(name: string): EntryConstructor | undefined;
  getName(entry: EntryConstructor): string | null;
}

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
  readonly route?: RouteEntry<EmptyShape>;
}

export type StyleEntryConstructor = {
  new (...args: unknown[]): StyleEntry;
};

export type StyleEntryOptions = {
  route?: RouteEntry<EmptyShape>;
  registry?: Registry;
};

export interface RouteEntry<D extends EntryDefinition> extends Route {
  readonly name: string;
  readonly definition?: D;
}

export type RouteEntryConstructor<D extends EntryDefinition> = {
  new (...args: unknown[]): RouteEntry<D>;
};

export type ShapeValueFor<C extends DefinitionConstructor> = C extends
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

export interface ElementEntry<D extends EntryDefinition> extends HTMLElement {
  readonly name: string;
  readonly render?: (attributes?: ShapeFor<D>) => CutoutGeneratorToken;
  readonly definition?: D;
  readonly route?: RouteEntry<EmptyShape>;
}

export type ElementEntryConstructor<D extends EntryDefinition> = {
  new (...args: unknown[]): ElementEntry<D>;
};

export type ElementEntryOptions<D extends EntryDefinition> = {
  definition?: D;
  registry?: Registry;
  render?: (attributes?: ShapeFor<D>) => CutoutGeneratorToken;
  connectedCallback?: () => void;
  attributeChangedCallback?: <K extends keyof D>(
    name: K,
    newValue: ShapeValueFor<D[K]>,
    oldValue: ShapeValueFor<D[K]>,
  ) => void;
  disconnectedCallback?: () => void;
  root?: string;
  route?: RouteEntry<EmptyShape>;
  stylesheet?: StyleEntry[];
};

type ElementJSXFunctionRenderOptions = {
  shallow: boolean;
};

export type ElementJSXFunction<D extends EntryDefinition> = (
  attributes?: ShapeFor<D>,
  options?: ElementJSXFunctionRenderOptions,
) => CutoutGeneratorToken;
