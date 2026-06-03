import type { AnyShape, EmptyShape } from "@cutout/internal";
import type { CutoutGeneratorToken } from "@cutout/jsx/tokens";

/**
 * @internal
 * This is published! We don't need to re-export it!
 */
type GeneratorToken = CutoutGeneratorToken;

export type Projection<T, O extends AnyShape = EmptyShape> = (
  token: GeneratorToken,
  options?: O,
) => T;
