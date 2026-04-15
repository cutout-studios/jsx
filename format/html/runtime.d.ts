import type { JSX as _JSX } from "../../jsx/module.ts";

import type {
  Attributes,
  BooleanAttributes,
  Elements,
  NumberAttributes,
  PickElementAttributes,
} from "../constants/types.ts";

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
    [key: `data-${string}`]: string | number;
    key?: string | number;
  };

declare namespace JSX {
  type IntrinsicElements =
    & _JSX.IntrinsicElements
    & {
      [E in Elements]: ResolveElementAttributes<E>;
    };
}
