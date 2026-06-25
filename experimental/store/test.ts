import { tokenizeValue } from "@cutout/jsx/tokens";
import { assert, assertArrayIncludes, assertFalse } from "@std/assert";
import { MemoryStore } from "./memory.ts";
import { ValidStoreToken } from "./types.ts";

const TEST_GROUP = "store";

Deno.test(`${TEST_GROUP} - MemoryStore`, () => {
  const store = new MemoryStore();

  const keyPath1: ValidStoreToken[] = [
    "users",
    123,
    "name",
  ].map(tokenizeValue);

  const valueList1: ValidStoreToken[] = [
    "bobadams",
  ].map(tokenizeValue);

  const keyPath2: ValidStoreToken[] = [
    "users",
    123,
    "address",
    "zip",
  ].map(tokenizeValue);

  const valueList2: ValidStoreToken[] = [
    12345,
  ].map(tokenizeValue);

  store.set(keyPath1, valueList1);
  store.set(keyPath2, valueList2);

  assert(store.has(keyPath1));
  assertArrayIncludes(store.get(keyPath1)!, valueList1);

  assert(store.has(keyPath2));
  assertArrayIncludes(store.get(keyPath2)!, valueList2);

  assert(store.delete(keyPath1));
  assertFalse(store.has(keyPath1));
  assert(store.has(keyPath2));
  assertFalse(store.get(keyPath1));
});

Deno.test(`${TEST_GROUP} - MemoryStore, escape`, () => {
  const store = new MemoryStore();

  const keyPath: ValidStoreToken[] = [
    '"test";',
  ].map(tokenizeValue);

  const valueList: ValidStoreToken[] = [
    '"cool:guy";',
  ].map(tokenizeValue);

  store.set(keyPath, valueList);
  assertArrayIncludes(store.get(keyPath)!, valueList);
});
