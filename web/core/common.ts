import { CutoutError, CutoutErrorCode } from "@cutout/web";
import type {
  ShapeDefinition,
  ShapeFromDefinition,
  ShapeValueConstructor,
} from "./types.ts";

// TODO(#51): nested element attribute definitions
export function parseRawShapeFromDefinition<D extends ShapeDefinition>(
  rawShape: Record<string, string | undefined>,
  definition: D,
): ShapeFromDefinition<D> {
  let result: ShapeFromDefinition<D> = {};

  for (const key in rawShape) {
    if (!rawShape[key]) continue;
    if (!definition[key]) continue;

    result = Object.assign({}, result, {
      [key]: parseRawValue(rawShape[key], definition[key]),
    });
  }

  return result as ShapeFromDefinition<D>;
}

export function parseRawValue(value: string, ctor: ShapeValueConstructor) {
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
