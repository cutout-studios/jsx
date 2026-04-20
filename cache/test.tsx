/** @jsxImportSource @cutout/jsx */

import { assertEquals } from "@std/assert/equals";
import { createCache } from "./module.ts";

const TEST_GROUP = "cache";

Deno.test(`${TEST_GROUP} - manual management via clear()`, () => {
  const cache = createCache();

  let renderCount = 0;
  const test = () => (
    <div>
      {cache(() => {
        renderCount++;
        return <span></span>;
      })}
    </div>
  );

  test();
  test();

  assertEquals(renderCount, 1);

  cache.clear();

  test();

  assertEquals(renderCount, 2);
});

Deno.test(`${TEST_GROUP} - watch()`, () => {
  let myVal = 0;
  const cache = createCache({
    watch: () => myVal,
  });

  let renderCount = 0;
  const test = () => (
    <div>
      {cache(() => {
        renderCount++;
        return <span></span>;
      })}
    </div>
  );

  test();
  test();

  assertEquals(renderCount, 1);

  myVal++;

  test();

  assertEquals(renderCount, 2);
});

Deno.test(`${TEST_GROUP} - watch() with compare()`, () => {
  const myObj = { myProp: false };
  const cache = createCache({
    watch: () => ({ ...myObj }),
    compare: (a, b) => a?.myProp === b?.myProp,
  });

  let renderCount = 0;
  const test = () => (
    <div>
      {cache(() => {
        renderCount++;
        return <span></span>;
      })}
    </div>
  );

  test();
  test();

  assertEquals(renderCount, 1);

  myObj.myProp = true;

  test();

  assertEquals(renderCount, 2);
});

// Deno.test(`${TEST_GROUP} - ttlMS`, () => {
// });

// Deno.test(`${TEST_GROUP} - ttlMS with watch()`, () => {
// });

// Deno.test(`${TEST_GROUP} - ttlMS with watch() and compare()`, () => {
// });
