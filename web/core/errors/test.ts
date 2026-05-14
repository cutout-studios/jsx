import { assert, assertEquals } from "@std/assert";
import { assertSnapshot } from "@std/testing/snapshot";
import { ERROR_STACK_OVERWRITTEN_MESSAGE } from "./constants.ts";
import { CutoutError } from "./error.ts";
import { toHTML } from "./jsx.tsx";

const TEST_GROUP = "web/errors";

Deno.test(`${TEST_GROUP} - CutoutError constructor`, async (test) => {
  await assertSnapshot(test, String(new CutoutError()));
});

Deno.test(`${TEST_GROUP} - CutoutError stack formatting is overwritten`, () => {
  assert(new CutoutError().stack?.includes(ERROR_STACK_OVERWRITTEN_MESSAGE));
});

Deno.test(`${TEST_GROUP} - non-CutoutError stack formatting is preserved`, () => {
  void new CutoutError();

  assert(!new Error().stack?.includes(ERROR_STACK_OVERWRITTEN_MESSAGE));
});

Deno.test(`${TEST_GROUP} - toHTML`, async (test) => {
  await assertSnapshot(test, toHTML(new CutoutError()));
});

Deno.test(`${TEST_GROUP} - CutoutError.getV8CallSiteParent`, () => {
  function test1() {
    function test2() {
      function test3() {
        assertEquals(
          CutoutError.getV8CallSiteParent()?.getFunctionName(),
          "test2",
        );
      }

      test3();
    }

    test2();
  }

  test1();
});
