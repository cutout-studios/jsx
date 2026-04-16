import type { CutoutGeneratorToken } from "@cutout/jsx/tokens";

/**
 * A CutoutFormatter transforms the output of the Cutout JSX process (token stream)
 * into a specified format (html string, json, so on...)
 */
export type CutoutFormatter<T> = (token: CutoutGeneratorToken) => T;
