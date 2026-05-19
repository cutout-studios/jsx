import type { AnyFunction, EmptyShape } from "@cutout/common";
import type { CutoutGeneratorToken } from "@cutout/jsx/tokens";
import type {
  ElementRenderer,
  EntryDefinition,
  Registry,
  RouteEntry,
  RouteRenderer,
  ShapeFor,
  ShapeValueFor,
  StyleEntry,
} from "../types.ts";

// Entry Factories
// Entry factory - route
export type RouteEntryFactory = <const D extends EntryDefinition>(
  path: string,
  options: RouteEntryFactoryOptions<D>,
) => RouteEntry<D>;

// TODO(#): parameter-based caching option via @std/cache
export type RouteEntryFactoryOptions<D extends EntryDefinition> =
  & FactoryBaseOptions
  & FactoryRenderableOptions<D, RouteRenderer<D>>;

// Entry factory - style
export type StyleEntryFactory = (
  cssText: string,
  options: StyleEntryFactoryOptions,
) => StyleEntry;

export type StyleEntryFactoryOptions =
  & FactoryBaseOptions
  & FactoryFileBasedRoutingOptions;

// Entry factory - element
export type ElementJSXFunctionFactory = <const D extends EntryDefinition>(
  tag: string,
  options: ElementJSXFunctionFactoryOptions<D>,
) => ElementJSXFunction<D>;

export type ElementJSXFunctionFactoryOptions<D extends EntryDefinition> =
  & FactoryBaseOptions
  & FactoryFileBasedRoutingOptions
  & FactoryRenderableOptions<D, ElementRenderer<D>>
  & {
    tagPrefix?: string;
    stylesheet?: StyleEntry[];
    connectedCallback?: () => void;
    attributeChangedCallback?: <K extends keyof D>(
      name: K,
      newValue: ShapeValueFor<D[K]>,
      oldValue: ShapeValueFor<D[K]>,
    ) => void;
    disconnectedCallback?: () => void;
  };

export type ElementJSXFunction<D extends EntryDefinition> = (
  attributes: ShapeFor<D>,
  options?: {
    shallow: boolean;
  },
) => CutoutGeneratorToken;

// Common Factory Options
type FactoryBaseOptions = {
  readonly registry: Registry;
};

type FactoryFileBasedRoutingOptions = {
  readonly root?: string;
  readonly route?: RouteEntry<EmptyShape>;
};

type FactoryRenderableOptions<
  D extends EntryDefinition,
  R extends AnyFunction,
> = {
  readonly definition?: D;
  readonly render?: R;
};
