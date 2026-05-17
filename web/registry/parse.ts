import { CutoutError, CutoutErrorCode } from "@cutout/web/errors";

import type { DefinitionConstructor } from "./types.ts";

export function parseRawValue(value: string, ctor: DefinitionConstructor) {
  switch (ctor) {
    case Number:
      return Number(value);
    case String:
      return value;
    case Boolean:
      return value === "";
    case Symbol:
      return Symbol(value);
    case Array:
    case Object:
      try {
        return JSON.parse(value);
      } catch (error) {
        throw new CutoutError(CutoutErrorCode.DATA_CORRUPTED, {
          context: value,
          cause: error,
        });
      }
    case Function:
      throw new CutoutError(CutoutErrorCode.OPERATION_INSECURE, {
        context: value,
      });
    default:
      throw new CutoutError(CutoutErrorCode.DATA_UNKNOWN, {
        context: value,
      });
  }
}
