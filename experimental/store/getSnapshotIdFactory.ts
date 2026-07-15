import { CutoutError } from "@cutout/internal";

const DEFAULT_ENCODING =
  "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";
const DEFAULT_BYTE_LENGTH = 16;

const BYTE_TO_BITS = 8;
const BITE_DEPTH = 2;
const BYTE_DEPTH = BITE_DEPTH ** BYTE_TO_BITS;
const TIMESTAMP_BYTE_LIMIT = 6;

function encode(bytes: Uint8Array, alphabet: string): string {
  const characterSpaceSize = Math.log2(alphabet.length);

  if (!Number.isInteger(characterSpaceSize)) throw new CutoutError();

  const mask = alphabet.length - 1;
  let [result, pointer, value, bitCount] = ["", 0, 0, 0];

  while (pointer < bytes.length) {
    value = (value << BYTE_TO_BITS) | bytes[pointer];
    bitCount += BYTE_TO_BITS;

    while (bitCount >= characterSpaceSize) {
      bitCount -= characterSpaceSize;
      result += alphabet[(value >>> bitCount) & mask];
    }

    value &= (1 << bitCount) - 1;
    pointer++;
  }

  if (bitCount > 0) {
    result += alphabet[(value << (characterSpaceSize - bitCount)) & mask];
  }

  return result;
}

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
      return new Uint8Array([...value]);
    }

    value[pointer] = 0;
  }

  return new Uint8Array();
}

export function getSnapshotIdFactory(
  {
    totalByteLength = DEFAULT_BYTE_LENGTH,
    alphabet = DEFAULT_ENCODING,
  } = {},
): () => string {
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

  return function getSnapshotId(): string {
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

    return (
      encode(timeToBytes(lastTime, timeByteLength), alphabet) +
      encode(lastRandom, alphabet)
    );
  };
}
