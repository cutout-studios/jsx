import type { AnyShape, EmptyShape } from "@cutout/common";
import type { CutoutGeneratorToken } from "@cutout/jsx/tokens";

/**
 * @internal
 * This is published! We don't need to re-export it!
 */
type GeneratorToken = CutoutGeneratorToken;

/**
 * A Formatter transforms the output of the Cutout JSX process (token stream)
 * into a specified format (html string, json, so on...)
 */
export type Formatter<T, O extends AnyShape = EmptyShape> = (
  token: GeneratorToken,
  options?: O,
) => T;
