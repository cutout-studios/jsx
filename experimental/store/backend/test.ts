// TODO: fix

// import {
//   assert,
//   assertArrayIncludes,
//   assertEquals,
//   assertFalse,
// } from "@std/assert";
// import { MemoryBackend } from "./memory.ts";
// import type { Path } from "./types.ts";

// const TEST_GROUP = "store/backend";

// Deno.test(`${TEST_GROUP} - MemoryBackend`, () => {
//   const backend = new MemoryBackend([]);

//   const namePath: Path = ["users", 123, "name", "bobadams"];
//   const zipPath: Path = ["users", 123, "address", "zip", 12345];

//   backend.add(namePath);
//   backend.add(zipPath);

//   assertArrayIncludes(backend.scan(["users", 123, "name"]), [
//     ["bobadams"],
//   ]);
//   assertArrayIncludes(
//     backend.scan(["users", 123, "address", "zip"]),
//     [[12345]],
//   );

//   assertEquals(backend.scan(["users", "nope"]), []);

//   assert(backend.delete(namePath));

//   assertFalse(backend.scan(["users", 123, "name"])[0]);
//   assertArrayIncludes(
//     backend.scan(["users", 123, "address", "zip"]),
//     [[12345]],
//   );

//   assertFalse(backend.delete(namePath));
// });

// Deno.test(`${TEST_GROUP} - MemoryBackend, limit`, () => {
//   const backend = new MemoryBackend([
//     ["nodes", "n1", "children", "c1"],
//     ["nodes", "n1", "children", "c2"],
//     ["nodes", "n1", "children", "c3"],
//   ]);

//   const childrenPrefix: Path = ["nodes", "n1", "children"];

//   assertEquals(backend.scan(childrenPrefix, { limit: 2 }).length, 2);

//   assertArrayIncludes(backend.scan(childrenPrefix, { limit: Infinity }), [
//     ["c1"],
//     ["c2"],
//     ["c3"],
//   ]);
// });
