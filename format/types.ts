import type { CutoutGeneratorToken } from "@cutout/jsx/tokens";

export type CutoutFormatter<T> = (token: CutoutGeneratorToken) => T;