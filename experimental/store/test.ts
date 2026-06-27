import { tokenizeValue } from "@cutout/jsx/tokens";
import { assert, assertArrayIncludes, assertFalse } from "@std/assert";
import { MemoryStore, type MemoryStoreToken } from "./memory.ts";

const TEST_GROUP = "store";

const tokenizeMemoryValue = (value: string | number): MemoryStoreToken => {
  return tokenizeValue(value) as MemoryStoreToken;
};

Deno.test(`${TEST_GROUP} - MemoryStore`, () => {
  const store = new MemoryStore();

  const keyPath1: MemoryStoreToken[] = [
    "users",
    123,
    "name",
  ].map(tokenizeMemoryValue);

  const valueList1: MemoryStoreToken[] = [
    "bobadams",
  ].map(tokenizeMemoryValue);

  const keyPath2: MemoryStoreToken[] = [
    "users",
    123,
    "address",
    "zip",
  ].map(tokenizeMemoryValue);

  const valueList2: MemoryStoreToken[] = [
    12345,
  ].map(tokenizeMemoryValue);

  store.set(keyPath1, valueList1);
  store.set(keyPath2, valueList2);

  assert(store.has(keyPath1));
  assertArrayIncludes([...store.get(keyPath1)![1]()], valueList1);

  assert(store.has(keyPath2));
  assertArrayIncludes([...store.get(keyPath2)![1]()], valueList2);

  assert(store.delete(keyPath1));
  assertFalse(store.has(keyPath1));
  assert(store.has(keyPath2));
  assertFalse([...store.get(keyPath1)![1]()][0]);
});

Deno.test(`${TEST_GROUP} - MemoryStore, escape`, () => {
  const store = new MemoryStore();

  const keyPath: MemoryStoreToken[] = [
    '"test";',
  ].map(tokenizeMemoryValue);

  const valueList: MemoryStoreToken[] = [
    '"cool:guy";',
  ].map(tokenizeMemoryValue);

  store.set(keyPath, valueList);
  assertArrayIncludes([...store.get(keyPath)![1]()], valueList);
});
