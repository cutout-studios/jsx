import type { AnyShape, EmptyShape } from "@cutout/common";
import type { CutoutGeneratorToken } from "@cutout/jsx/tokens";

/**
 * A Formatter transforms the output of the Cutout JSX process (token stream)
 * into a specified format (html string, json, so on...)
 */
export type Formatter<T, O extends AnyShape = EmptyShape> = (
  token: CutoutGeneratorToken,
  options?: O,
) => T;
