import type { ELEMENTS, GLOBAL_ATTRIBUTE_LIST } from "./constants.ts";

// TODO: data-* + aria labels?
// deno-lint-ignore no-namespace
export namespace JSX {
  export type IntrinsicElements = {
    [K in keyof typeof ELEMENTS]: {
      [A in (typeof ELEMENTS)[K][number] | (typeof GLOBAL_ATTRIBUTE_LIST)[number]]?: string
    };
  }
}
