import { assertSnapshot } from "@std/testing/snapshot";

import { CutoutError } from "./module.ts";
import { CutoutErrorCode } from "./types.ts";

Deno.test("CutoutError", async (test) => {
  const error = new CutoutError({
    code: CutoutErrorCode.DATA_UNKNOWN,
    guidance: "Well, this *is* a test after all!",
  });

  await assertSnapshot(test, error.message);
});
