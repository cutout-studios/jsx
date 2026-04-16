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

declare namespace JSX {
  type IntrinsicElements =
    // Maintains continuity with how the base IntrinsicElements must behave,
    // permitting unknown elements while restricting known ones.
    & _JSX.IntrinsicElements
    & {
      [E in Elements]: ResolveElementAttributes<E>;
    };
}

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
    classlist?: DOMTokenList;

    // Also permissive: permits unknown attributes.
    [unknown: string]: unknown;
  };
