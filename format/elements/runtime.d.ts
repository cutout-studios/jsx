import type {
  Attributes,
  BooleanAttributes,
  FunctionAttributes,
  Elements,
  NumberAttributes,
  PickElementAttributes,
} from "../constants/types.ts";

type AnyFunction = (...args: unknown[]) => unknown;

type ResolveSupportedAttributeType<A extends Attributes> = A extends
  BooleanAttributes ? boolean | string
  : A extends NumberAttributes ? number | string
  : A extends FunctionAttributes ? AnyFunction
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
  type IntrinsicElements = {
    [E in Elements]: ResolveElementAttributes<E>;
  };
}
