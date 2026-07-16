import { CUTOUT_TOKEN_VALUE_INDEX, tokenizeValue } from "@cutout/jsx/tokens";
import {
  assert,
  assertArrayIncludes,
  assertEquals,
  assertFalse,
} from "@std/assert";
import { MemoryBackend } from "./memory.ts";
import type { TokenPath } from "./types.ts";

const TEST_GROUP = "store/backend";

const tokenizePath = (path: (string | number)[]): TokenPath => {
  return path.map(tokenizeValue) as TokenPath;
};

Deno.test(`${TEST_GROUP} - MemoryBackend`, () => {
  const backend = new MemoryBackend([]);

  const namePath = tokenizePath(["users", 123, "name", "bobadams"]);
  const zipPath = tokenizePath(["users", 123, "address", "zip", 12345]);

  backend.add(namePath);
  backend.add(zipPath);

  assertArrayIncludes(
    backend.list(tokenizePath(["users", 123, "name"]))?.toArray() ?? [],
    [
      tokenizePath(["bobadams"]),
    ],
  );
  assertArrayIncludes(
    backend.list(tokenizePath(["users", 123, "address", "zip"]))?.toArray() ??
      [],
    [tokenizePath([12345])],
  );

  assertEquals(
    backend.list(["users", "nope"].map(tokenizeValue) as TokenPath)
      ?.toArray() ?? [],
    [],
  );

  assert(backend.delete(namePath)[CUTOUT_TOKEN_VALUE_INDEX]);

  assertFalse(backend.list(tokenizePath(["users", 123, "name"]))?.toArray()[0]);
  assertArrayIncludes(
    backend.list(tokenizePath(["users", 123, "address", "zip"]))?.toArray() ??
      [],
    [tokenizePath([12345])],
  );

  assertFalse(backend.delete(namePath)[CUTOUT_TOKEN_VALUE_INDEX]);
});

Deno.test(`${TEST_GROUP} - MemoryBackend, limit`, () => {
  const backend = new MemoryBackend([
    ["nodes", "n1", "children", "c1"],
    ["nodes", "n1", "children", "c2"],
    ["nodes", "n1", "children", "c3"],
  ].map(tokenizePath));

  const childrenPrefix = tokenizePath(["nodes", "n1", "children"]);

  assertEquals(backend.list(childrenPrefix, { limit: 2 })?.toArray().length, 2);

  assertArrayIncludes(
    backend.list(childrenPrefix, { limit: Infinity })?.toArray() ?? [],
    [
      ["c1"],
      ["c2"],
      ["c3"],
    ].map(tokenizePath),
  );
});
