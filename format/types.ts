import type { CutoutGeneratorToken } from "@cutout/jsx/tokens";

// TODO(#11): enforce allowed tokens
export type CutoutFormatter<T> = (token: CutoutGeneratorToken) => T;
