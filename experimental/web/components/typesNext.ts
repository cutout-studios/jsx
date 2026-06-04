import type {
  AnyArray,
  AnyFunction,
  AnyShape,
  OneOrMany,
  Writeable,
} from "@cutout/internal";
import type { CutoutGeneratorToken } from "@cutout/jsx/tokens";
import type { CutoutProjection } from "@cutout/web/projections";
import type { SupportedHTTPMethods } from "./constants.ts";

type TypeDefinition = Readonly<
  Record<PropertyKey, ValidDefinitionConstructor>
>;

export interface Type<D extends TypeDefinition> extends Base {
  readonly definition: D;
}

export interface Endpoint<D extends TypeDefinition>
  extends
    Base,
    Typeable<D>,
    Renderable<[parameters: ShapeFor<D>, request: Request], Response> {
  readonly projection: OneOrMany<CutoutProjection>;
  readonly method: OneOrMany<SupportedHTTPMethods>;
  readonly search?: string;
}

export interface Router extends Base, Renderable<[Request]> {
  readonly static: boolean;
}

export interface Element<D extends TypeDefinition>
  extends
    HTMLElement,
    Base,
    Typeable<D>,
    Renderable<[parameters: ShapeFor<D>]> {
  readonly tag: string;
}

export interface Style extends CSSRule, Base {
  readonly content: string;
}

interface Base {
  readonly name: string;
  readonly router: Router;
}

interface Typeable<D extends TypeDefinition> {
  readonly type: Type<D>;
}

interface Renderable<I extends Array<unknown>, O = CutoutGeneratorToken> {
  render(...inputs: I): O;
}

/** @internal */
export type OptionsFor<C extends Base> = Writeable<Omit<C, "router">>;

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
export type ShapeFor<T extends TypeDefinition> = {
  [K in keyof T]?: ShapeValueFor<T[K]>;
};
