import { tokenizeValue } from "@cutout/jsx/tokens";
import { assert, assertArrayIncludes, assertFalse } from "@std/assert";
import { MemoryStore } from "./memory.ts";
import type { ValidStoreToken } from "./types.ts";

const TEST_GROUP = "store";

const tokenizeStoreValue = (value: string | number): ValidStoreToken => {
  return tokenizeValue(value) as ValidStoreToken;
};

Deno.test(`${TEST_GROUP} - MemoryStore`, () => {
  const store = new MemoryStore();

  const keyPath1: ValidStoreToken[] = [
    "users",
    123,
    "name",
  ].map(tokenizeStoreValue);

  const valueList1: ValidStoreToken[] = [
    "bobadams",
  ].map(tokenizeStoreValue);

  const keyPath2: ValidStoreToken[] = [
    "users",
    123,
    "address",
    "zip",
  ].map(tokenizeStoreValue);

  const valueList2: ValidStoreToken[] = [
    12345,
  ].map(tokenizeStoreValue);

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
  ].map(tokenizeStoreValue);

  const valueList: ValidStoreToken[] = [
    '"cool:guy";',
  ].map(tokenizeStoreValue);

  store.set(keyPath, valueList);
  assertArrayIncludes(store.get(keyPath)!, valueList);
});
