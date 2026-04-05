import type { CutoutGeneratorToken } from "@cutout/jsx/tokens";

// TODO: enforce allowed tokens
export type CutoutFormatter<T> = (token: CutoutGeneratorToken) => T;
