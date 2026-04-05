import { type CutoutGeneratorToken, CutoutTokenType, type ValidCutoutToken } from "@cutout/jsx/tokens";
import { decode } from "@std/msgpack";

export const unpack = (data: Uint8Array): CutoutGeneratorToken => {
  const [typeIndex, valueIndex, tokenData] = decode(data) as [number[], Uint8Array[], number[]];

  return [
    CutoutTokenType.GENERATOR,
    (function* unpackedGenerator() {
      for (const valueId of tokenData) {
        const type = typeIndex[valueId];
        const value = valueIndex[valueId];

        // TODO: properly unwrap value, warn on missing functions
        yield [type, value] as ValidCutoutToken;
      }
    })(),
  ];
};
