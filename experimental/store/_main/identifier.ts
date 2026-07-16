import { CutoutError } from "@cutout/internal";
import {
  type CutoutIdentifierToken,
  CutoutTokenType,
} from "@cutout/jsx/tokens";

import {
  BYTE_DEPTH,
  DEFAULT_IDENTIFIER_BYTE_LENGTH,
  TIMESTAMP_BYTE_LIMIT,
} from "./constants.ts";

function timeToBytes(time: number, bytes: number): Uint8Array {
  if (bytes > TIMESTAMP_BYTE_LIMIT) throw new CutoutError();

  const result = new Uint8Array(bytes);

  let pointer = result.length;
  while (pointer--) {
    result[pointer] = time % BYTE_DEPTH;
    time = Math.floor(time / BYTE_DEPTH);
  }

  return result;
}

function increment(value: Uint8Array): Uint8Array<ArrayBuffer> {
  let pointer = value.length;
  while (pointer--) {
    if (value[pointer] < BYTE_DEPTH - 1) {
      value[pointer]++;
      const container = new Uint8Array(value.length);
      container.set(value);
      return container;
    }

    value[pointer] = 0;
  }

  return new Uint8Array();
}

export function getIdentifierTokenFactory(
  {
    totalByteLength = DEFAULT_IDENTIFIER_BYTE_LENGTH,
  } = {},
): () => CutoutIdentifierToken {
  let randomByteLength, timeByteLength;

  if (totalByteLength <= TIMESTAMP_BYTE_LIMIT) {
    timeByteLength = Math.ceil(totalByteLength / 2);
    randomByteLength = Math.floor(totalByteLength / 2);
  } else {
    timeByteLength = TIMESTAMP_BYTE_LIMIT;
    randomByteLength = totalByteLength - TIMESTAMP_BYTE_LIMIT;
  }

  let lastTime = -1;
  let lastRandom = new Uint8Array(randomByteLength);

  return function getIdentifierToken(): CutoutIdentifierToken {
    const now = Date.now();

    if (now <= lastTime) {
      lastRandom = increment(lastRandom);

      if (!lastRandom.length) {
        lastTime += 1;
        lastRandom = crypto.getRandomValues(new Uint8Array(randomByteLength));
      }
    } else {
      lastTime = now;
      lastRandom = crypto.getRandomValues(lastRandom);
    }

    const result = new Uint8Array(totalByteLength);

    result.set(timeToBytes(lastTime, timeByteLength));
    result.set(lastRandom, timeByteLength);

    return [CutoutTokenType.IDENTIFIER, result];
  };
}
