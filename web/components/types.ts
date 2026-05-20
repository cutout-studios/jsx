import type {
  AnyArray,
  AnyFunction,
  AnyShape,
  EmptyShape,
} from "@cutout/common";
import type { CutoutGeneratorToken } from "@cutout/jsx/tokens";
import type { Route as _Route } from "@std/http/route";
import type { Registry } from "./registry/types.ts";

/**
 * Used to define a `@cutout/web` component's attributes or parameters.
 *
 * TODO(#51): support nested definitions
 *
 * @example
 * ```ts
 * const definition: EntryDefinition = { name: String };
 *
 * validateData(definition, { name: "John" }); // Valid
 * validateData(definition, { name: 3 }); // Invalid
 * ```
 */
export type Definition = Readonly<
  Record<PropertyKey, ValidDefinitionConstructor>
>;

export interface Route<D extends Definition> extends StandardRoute {
  readonly name: string;
  readonly definition?: D;
  readonly render?: RouteRenderFunction<D>;
}

export type RouteRenderFunction<D extends Definition> = (
  parameters: ShapeFor<D>,
  request?: Request,
) => Promise<GeneratorToken | string>;

// TODO(#): parameter-based caching option via @std/cache
export type RouteOptions<D extends Definition> =
  & FactoryBaseOptions
  & FactoryRenderableOptions<D, RouteRenderFunction<D>>;

export interface Style extends CSSRule {
  readonly name: string;
  readonly route?: Route<EmptyShape>;
}

export type StyleOptions =
  & FactoryBaseOptions
  & FactoryFileBasedRoutingOptions;

export interface Element<D extends Definition> extends HTMLElement {
  readonly name: string;
  readonly definition?: D;
  readonly render?: ElementRenderFunction<D>;
}

export type ElementRenderFunction<D extends Definition> = (
  attributes: ShapeFor<D>,
) => GeneratorToken;

export type ElementJSX<D extends Definition> = (
  attributes: ShapeFor<D>,
  options?: {
    shallow: boolean;
  },
) => GeneratorToken;

export type ElementJSXOptions<D extends Definition> =
  & FactoryBaseOptions
  & FactoryFileBasedRoutingOptions
  & FactoryRenderableOptions<D, ElementRenderFunction<D>>
  & {
    tagPrefix?: string;
    stylesheet?: Style[];
    connectedCallback?: () => void;
    attributeChangedCallback?: <K extends keyof D>(
      name: K,
      newValue: ShapeValueFor<D[K]>,
      oldValue: ShapeValueFor<D[K]>,
    ) => void;
    disconnectedCallback?: () => void;
  };

/** @internal */
type FactoryBaseOptions = {
  readonly registry: Registry;
};

/** @internal */
type FactoryFileBasedRoutingOptions = {
  readonly root?: string;
  readonly route?: Route<EmptyShape>;
};

/** @internal */
type FactoryRenderableOptions<
  D extends Definition,
  R extends AnyFunction,
> = {
  readonly definition?: D;
  readonly render?: R;
};

/** @internal */
export type ValidDefinitionConstructor =
  | typeof Number
  | typeof String
  | typeof Boolean
  | typeof Symbol
  | typeof Function
  | typeof Array
  | typeof Object;

/** @internal */
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

/** @internal */
export type ShapeFor<T extends Definition> = {
  [K in keyof T]?: ShapeValueFor<T[K]>;
};

// These are published! We do not need to re-export them in the module!
/** @internal */
type StandardRoute = _Route;

/** @internal */
type GeneratorToken = CutoutGeneratorToken;
