/** @jsx jsx */

import type { CutoutGeneratorToken, ValidCutoutToken } from "@cutout/jsx/model";
import { assertSnapshot } from "@std/testing/snapshot";

// `jsx` _is_ used here (as the pragma), the linter just can't see it.
// deno-lint-ignore verbatim-module-syntax
import { jsx } from "./module.ts";

const _expand = (generatorToken: CutoutGeneratorToken): ValidCutoutToken[] => {
  return [...generatorToken[1]];
};

Deno.test("jsx - simple case", async (test) => {
  await assertSnapshot(test, _expand(<div></div>));
});

Deno.test("jsx - props", async (test) => {
  await assertSnapshot(
    test,
    _expand(<div style={{ color: "red" }} id="my-cool-div"></div>),
  );
});

Deno.test("jsx - children", async (test) => {
  await assertSnapshot(
    test,
    _expand(
      <ul>
        <li>Child #1</li>
        <li>Child #2</li>
        <li>Child #3</li>
      </ul>,
    ),
  );
});

// Deno.test("jsx - children + props", () => {
// });

// Deno.test("jsx - nested children", () => {
// });

// Deno.test("jsx - nested children with props", () => {
// });

// Deno.test("jsx - fragment", () => {
// });
