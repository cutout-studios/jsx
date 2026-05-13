import { assertSnapshot } from "@std/testing/snapshot";
import { CutoutError } from "./error.ts";
import { toHTML } from "./jsx.tsx";

const TEST_GROUP = "@cutout/web/errors";

Deno.test(`${TEST_GROUP} - CutoutError constructor`, async (test) => {
  await assertSnapshot(test, String(new CutoutError()));
});

Deno.test(`${TEST_GROUP} - CutoutError.getParentCallSite`, (test) => {
  function test1() {
    function test2 () {
     async function test3 () {
        await assertSnapshot(test, CutoutError.getParentCallSite());
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
