import type { JSX as _JSX } from "../../module.ts";

import type {
  Attributes,
  BooleanAttributes,
  Elements,
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
  : string;

type ResolveElementAttributes<E extends Elements> =
  & {
    [
      A in Attributes as PickElementAttributes<E, A>
    ]?: ResolveSupportedAttributeType<A>;
  }
  & {
    key?: string | number;

    // Also permissive: permits unknown attributes.
    [unknown: string]: unknown;
  };
