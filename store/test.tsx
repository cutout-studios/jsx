/** @jsxImportSource @cutout/jsx */

import { MemoryStore } from "./memory.ts";

const TEST_GROUP = "store";

Deno.test(`${TEST_GROUP} - MemoryStore`, () => {
  const store = new MemoryStore();

  // TOOD: has, get, set, delete
});

Deno.test(`${TEST_GROUP} - MemoryStore, entries`, () => {
  const store = new MemoryStore(
    <ul id="users">
      <li key={123}>

      </li>
      <li key={456}>

      </li>
      <li key={789}>

      </li>
    </ul>
  );

  // TODO: has, get, set, delete
});
