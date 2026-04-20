import { CutoutTokenType, TOKEN_VALUE_INDEX } from "@cutout/jsx/tokens";
import type {
  CutoutGeneratorToken,
  CutoutOutputToken,
} from "@cutout/jsx/tokens";

export type CutoutCacheConfig<T> = {
  ttlMS?: number;
  watch?: () => T;
  compare?: (a: T | undefined, b: T | undefined) => boolean;
};

export function createCache<T>(
  { ttlMS, watch, compare = (a, b) => a === b }: CutoutCacheConfig<T> = {},
) {
  let cachedInput: T | undefined,
    cachedOutput: CutoutOutputToken[] | undefined,
    lastRendered: number;

  const _copyCachedGenerator = (): CutoutGeneratorToken => [
    CutoutTokenType.GENERATOR,
    (function* () {
      yield* cachedOutput!;
    })(),
  ];

  const _renderFreshGenerator = (
    render: (input: T | undefined) => CutoutGeneratorToken,
  ): CutoutGeneratorToken => {
    cachedOutput = [...(render(cachedInput)[TOKEN_VALUE_INDEX])];
    lastRendered = Date.now();

    return _copyCachedGenerator();
  };

  function cache(
    render: (input: T | undefined) => CutoutGeneratorToken,
  ): CutoutGeneratorToken {
    if (
      ttlMS !== undefined &&
      Date.now() - lastRendered < ttlMS
    ) {
      return _renderFreshGenerator(render);
    }

    if (cachedOutput === undefined) {
      return _renderFreshGenerator(render);
    }
    
    if (cachedOutput !== undefined && !watch) {
      return _copyCachedGenerator();
    }

    if (cachedOutput !== undefined && watch) {
      const currentInput = watch();

      if (compare(cachedInput, currentInput)) {
        return _copyCachedGenerator();
      }

      cachedInput = currentInput;
    }

    return _renderFreshGenerator(render);
  }

  return Object.assign(cache, {
    clear() {
      console.log("clear called");
      cachedInput = undefined;
      cachedOutput = undefined;
      lastRendered = 0;
    },
  });
}
