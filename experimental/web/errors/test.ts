import { assertSnapshot } from "@std/testing/snapshot";
import { CutoutError } from "./error.ts";
import { toHTML } from "./jsx.tsx";

const TEST_GROUP = "web/errors";

Deno.test(`${TEST_GROUP} - CutoutError constructor`, async (test) => {
  await assertSnapshot(test, String(new CutoutError()));
});

Deno.test(`${TEST_GROUP} - toHTML`, async (test) => {
  await assertSnapshot(test, toHTML(new CutoutError()));
});
