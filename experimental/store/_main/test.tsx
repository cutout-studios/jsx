/** @jsxImportSource @cutout/jsx */

import { rawText } from "@cutout/jsx/projections";
import { CutoutMemoryBackend } from "@cutout/store/backend";
import { parseSelector } from "@cutout/store/selector";
import { assertSnapshot } from "@std/testing/snapshot";

import { create } from "./create.ts";

const TEST_MODULE = "store";

Deno.test(TEST_MODULE, async (test) => {
  const store = create({ backend: new CutoutMemoryBackend() });

  store.append(
    <>
      <user id={1}>
        <username>Bob</username>
      </user>
      <user id={2}>
        <username>Janet</username>
      </user>
    </>,
  );

  await assertSnapshot(test, rawText(store.select(parseSelector("user#1"))[0]));

  store.append(
    <user id={1}>
      <username>Bobby</username>
    </user>,
  );

  await assertSnapshot(test, rawText(store.select(parseSelector("user#1"))[0]));
});
