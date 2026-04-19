import { assertSnapshot } from "@std/testing/snapshot";

import { CutoutError } from "./module.ts";
import { CutoutErrorCode } from "./types.ts";

Deno.test("CutoutError", async (test) => {
  const error = new CutoutError(CutoutErrorCode.DATA_UNKNOWN, {
    context: function testFunction() {},
    guidance: "This is a test! No guidance needed!",
  });

  await assertSnapshot(test, String(error));
});
