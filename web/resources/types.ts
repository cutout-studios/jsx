import type { AnyArray, AnyFunction, AnyShape } from "@cutout/common";

// TODO(#51): nested attribute definitions
type ShapeValueConstructor =
  | typeof Number
  | typeof String
  | typeof Boolean
  | typeof Symbol
  | typeof Function
  | typeof Array
  | typeof Object;

type ShapeDefinition = Record<string, ShapeValueConstructor>;

type InstanceTypeFromConstructor<C> = C extends typeof Number ? number
  : C extends typeof BigInt ? bigint
  : C extends typeof String ? string
  : C extends typeof Boolean ? boolean
  : C extends typeof Symbol ? symbol
  : C extends typeof Function ? AnyFunction
  : C extends typeof Array ? AnyArray
  : C extends typeof Object ? AnyShape
  : never;

type ShapeFromDefinition<T extends ShapeDefinition> = {
  [K in keyof T]?: InstanceTypeFromConstructor<T[K]>;
};

export enum ResourceType {
  STYLE_RULE,
  SERVER_ROUTE,
  BROWSER_ELEMENT,
}

type InstanceFromResourceType<T extends ResourceType> = T extends
  ResourceType.STYLE_RULE ? CSSRule
  : T extends ResourceType.SERVER_ROUTE ? Response
  : T extends ResourceType.BROWSER_ELEMENT ? HTMLElement
  : never;

type ResourceOptions<
  T extends ResourceType,
  D extends ShapeDefinition,
> = {
  type: ResourceType;
  fileLocation?: URL;
  attributes?: D;
  render?: (attributes: ShapeFromDefinition<D>) => T;
};

export type Resource<T extends ResourceType, D extends ShapeDefinition> =
  & InstanceFromResourceType<T>
  & ResourceOptions<T, D>;

export type AnyResource = Resource<ResourceType, ShapeDefinition>;
