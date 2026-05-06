import { CutoutError, CutoutErrorCode } from "@cutout/web";
import type {
  InstanceTypeFromConstructor,
  ShapeDefinition,
  ShapeFromDefinition,
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

    const keyTypeConstructor = definition[key];
    let value:
      | InstanceTypeFromConstructor<typeof keyTypeConstructor>
      | undefined;

    switch (keyTypeConstructor) {
      case Number: {
        const _value = Number(rawShape[key]);
        if (!isNaN(_value)) {
          value = _value;
        }
        break;
      }
      case String:
        value = rawShape[key];
        break;
      case Boolean:
        value = rawShape[key] === "";
        break;
      case Symbol:
        value = Symbol(rawShape[key]);
        break;
      case Array:
      case Object:
        try {
          value = JSON.parse(rawShape[key]);
        } catch (error) {
          throw new CutoutError(CutoutErrorCode.DATA_CORRUPTED, {
            context: rawShape[key],
            cause: error,
          });
        }
        break;
      case Function:
        throw new CutoutError(CutoutErrorCode.OPERATION_INSECURE, {
          context: rawShape[key],
        });
      default:
        throw new CutoutError(CutoutErrorCode.DATA_UNKNOWN, {
          context: rawShape[key],
        });
    }

    result = Object.assign({}, result, { [key]: value });
  }

  return result as ShapeFromDefinition<D>;
}
