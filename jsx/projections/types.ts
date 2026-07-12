import type { AnyShape, EmptyShape } from "@cutout/internal";
import type { CutoutJSXToken } from "@cutout/jsx/tokens";

/**
 * A "projection" is a function used to cast JSX to a different format.
 */
export type Projection<T = unknown, O extends AnyShape = EmptyShape> = (
  jsx: CutoutJSXToken,
  options?: O,
) => T;
