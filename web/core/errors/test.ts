import { assertEquals } from "@std/assert";
import { assertSnapshot } from "@std/testing/snapshot";
import { CutoutError } from "./error.ts";
import { toHTML } from "./jsx.tsx";

const TEST_GROUP = "@cutout/web/errors";

Deno.test(`${TEST_GROUP} - CutoutError constructor`, async (test) => {
  await assertSnapshot(test, String(new CutoutError()));
});

Deno.test(`${TEST_GROUP} - CutoutError.getParentCallSite`, () => {
  function test1() {
    function test2() {
      function test3() {
        assertEquals(
          CutoutError.getParentCallSite()?.getFunctionName(),
          "test2",
        );
      }

      test3();
    }

    test2();
  }

  test1();
});

Deno.test(`${TEST_GROUP} - toHTML`, async (test) => {
  await assertSnapshot(test, toHTML(new CutoutError()));
});
