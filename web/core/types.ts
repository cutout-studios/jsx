import type { AnyArray, AnyFunction, AnyShape } from "@cutout/common";
import type { CutoutGeneratorToken } from "@cutout/jsx/tokens";
import type { Route } from "@std/http/route";

// TODO(#51): nested attribute definitions
export type ShapeValueConstructor =
  | typeof Number
  | typeof String
  | typeof Boolean
  | typeof Symbol
  | typeof Function
  | typeof Array
  | typeof Object;

type ShapeValue =
  | number
  | bigint
  | string
  | boolean
  | symbol
  | AnyFunction
  | AnyArray
  | AnyShape;

export type Shape = Record<string, ShapeValue>;
export type ShapeDefinition = Record<string, ShapeValueConstructor>;

export type InstanceTypeFromConstructor<C> = C extends typeof Number ? number
  : C extends typeof BigInt ? bigint
  : C extends typeof String ? string
  : C extends typeof Boolean ? boolean
  : C extends typeof Symbol ? symbol
  : C extends typeof Function ? AnyFunction
  : C extends typeof Array ? AnyArray
  : C extends typeof Object ? AnyShape
  : never;

export type ShapeFromDefinition<T extends ShapeDefinition> = {
  [K in keyof T]?: InstanceTypeFromConstructor<T[K]>;
};

type Resource = {
  readonly location: URL;
  readonly dependencies?: Resource[];
};
type StaticResource<T extends object> = T & Resource;
type DynamicResource<T, D extends ShapeDefinition, O = unknown> =
  & ((
    attributes: ShapeFromDefinition<D>,
    options?: O,
  ) => T)
  & Resource
  & { readonly attributes?: D };

export type RouteResource = StaticResource<Route>;

export type ElementResourceOptions = {
  dsd?: boolean;
  registry?: CustomElementRegistry;
};

export type ElementResource<D extends ShapeDefinition> = DynamicResource<
  CutoutGeneratorToken,
  D,
  ElementResourceOptions
>;
export type StyleResource = StaticResource<CSSRule>;
