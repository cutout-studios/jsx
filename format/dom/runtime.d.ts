import type { JSX as _JSX } from "../../jsx/module.ts";
import type { AnyFunction } from "../../tokens/types.ts";

import type {
  Attributes,
  BooleanAttributes,
  Elements,
  FunctionAttributes,
  NumberAttributes,
  PickElementAttributes,
} from "../constants/types.ts";

type ResolveSupportedAttributeType<A extends Attributes> = A extends
  BooleanAttributes ? boolean | string
  : A extends NumberAttributes ? number | string
  : A extends FunctionAttributes ? AnyFunction
  : string;

type ResolveElementAttributes<E extends Elements> =
  & Omit<
    {
      [
        A in Attributes as PickElementAttributes<E, A>
      ]?: ResolveSupportedAttributeType<A>;
    },
    "style"
  >
  & {
    key?: string | number;
    style?: CSSStyleDeclaration;
    dataset?: DOMStringMap;
  };

declare namespace JSX {
  type IntrinsicElements =
    & _JSX.IntrinsicElements
    & {
      [E in Elements]: ResolveElementAttributes<E>;
    };
}
