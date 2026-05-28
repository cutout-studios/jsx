import { assert, assertEquals } from "@std/assert";

import { V8CallSite } from "./callsite.ts";
import { CALLSITE_OVERWRITTEN_MESSAGE } from "./constants.ts";

const TEST_GROUP = "internal";

Deno.test(`${TEST_GROUP} - V8CallSite, stack formatting is overwritten`, () => {
  assert(new V8CallSite().stack?.includes(CALLSITE_OVERWRITTEN_MESSAGE));
});

Deno.test(`${TEST_GROUP} - V8CallSite, non-V8CallSite stack formatting is preserved`, () => {
  void new V8CallSite();

  assert(!new Error().stack?.includes(CALLSITE_OVERWRITTEN_MESSAGE));
});

Deno.test(`${TEST_GROUP} - V8CallSite.getParent`, () => {
  function test1() {
    function test2() {
      function test3() {
        assertEquals(
          V8CallSite.getParent()?.getFunctionName(),
          "test2",
        );
      }

      test3();
    }

    test2();
  }

  test1();
});
