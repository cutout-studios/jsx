import { CutoutTokenType, type ValidCutoutToken } from "@cutout/jsx/tokens";
import { encode, type ValueType } from "@std/msgpack";

import type { CutoutFormatter } from "../types.ts";

// Note: we'll attempt to preserve functions, lol, but good luck
export const pack: CutoutFormatter<Uint8Array> = ([, generator]) => {
  const typeIndex = [];
  const valueIndex = [];
  const data = [];

  const indexLookup = new Map();
  for (const token of generator) {
    const [type, value] = token;

    let valueId = indexLookup.get(value);
    if (valueId === undefined) {
      valueId = valueIndex.length;
      indexLookup.set(value, valueId);

      typeIndex.push(type);
      valueIndex.push(_attemptTokenEncode(token));
    }

    data.push(valueId);
  }

  return encode([typeIndex, valueIndex, data]);
};

function _attemptTokenEncode(token: ValidCutoutToken): Uint8Array {
  try {
    switch (token[0]) {
      case CutoutTokenType.ELEMENT_OPEN:
      case CutoutTokenType.ELEMENT_CLOSE:
      case CutoutTokenType.PROPERTY:
      case CutoutTokenType.STRING:
      case CutoutTokenType.NUMBER:
      case CutoutTokenType.BOOLEAN:
      case CutoutTokenType.NULL:
        return encode(token[1]);
      case CutoutTokenType.UNDEFINED:
        return encode(null);
      case CutoutTokenType.SYMBOL:
        return encode(token[1].toString());
      case CutoutTokenType.FUNCTION: // TODO: inject context back into the unpacker
        return encode(token[1].name);
      case CutoutTokenType.ARRAY:
      case CutoutTokenType.OBJECT:
        try {
          return encode(token[1] as ValueType);
        } catch {
          // no-op, we'll attempt to stringify the value instead
        }

        return encode(JSON.stringify(token[1]));
      case CutoutTokenType.GENERATOR:
        throw new Error(
          `Cannot encode generator token directly - generators must be fully consumed and their tokens encoded separately.`,
        );
    }
  } catch (cause) {
    throw new Error(`Failed to encode token of type "${token[0]}".`, { cause });
  }
}
