import type {
  InstanceTypeFromConstructor,
  ShapeDefinition,
  ShapeFromDefinition,
} from "./types.ts";

// TODO: nested definitions
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
        } catch {
          // TODO: Error?
        }
        break;
      case Function:
      default:
        // TODO: Error
    }

    result = Object.assign({}, result, { [key]: value });
  }

  return result as ShapeFromDefinition<D>;
}
