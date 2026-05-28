import { CutoutError, CutoutErrorCode } from "@cutout/web/errors";

import type { ShapeValueFor, ValidDefinitionConstructor } from "./types.ts";

export function parseRawValue<C extends ValidDefinitionConstructor>(
  value: string,
  constructor: C,
): ShapeValueFor<C> {
  switch (constructor) {
    case Number:
      return Number(value) as ShapeValueFor<C>;
    case String:
      return value as ShapeValueFor<C>;
    case Boolean:
      return (value !== "false") as ShapeValueFor<C>;
    case Symbol:
      return Symbol(value) as ShapeValueFor<C>;
    case Array:
    case Object:
      try {
        return JSON.parse(value) as ShapeValueFor<C>;
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
