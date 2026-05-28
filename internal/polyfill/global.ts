import type { AnyShape } from "../types.ts";

// Module-local cast. globalThis's *type* is unchanged for other modules;
// we just need to satisfy TS for these specific assignments here.
export const _globalThis = globalThis as unknown as AnyShape;
