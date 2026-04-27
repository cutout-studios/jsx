/** @jsxImportSource @cutout/jsx */

import { assertSnapshot } from "@std/testing/snapshot";
import type { CutoutGeneratorToken } from "./tokens/types.ts";

const TEST_GROUP = "jsx";

Deno.test(`${TEST_GROUP} - simple case`, assertCutoutJsxSnapshot(<div></div>));

Deno.test(
  `${TEST_GROUP} - props`,
  assertCutoutJsxSnapshot(
    <div style={{ color: "red" }} id="my-cool-div"></div>,
  ),
);

Deno.test(
  `${TEST_GROUP} - children`,
  assertCutoutJsxSnapshot(
    <ul>
      <li>Child #1</li>
      <li>Child #2</li>
      <li>Child #3</li>
    </ul>,
  ),
);

Deno.test(
  `${TEST_GROUP} - mapped children`,
  assertCutoutJsxSnapshot(
    <ul>
      {["Child #1", "Child #2", "Child #3"].map((message, index) => (
        <li key={index}>{message}</li>
      ))}
    </ul>,
  ),
);

Deno.test(
  `${TEST_GROUP} - children + props`,
  assertCutoutJsxSnapshot(
    <ul id="main">
      <li class="selected">Child #1</li>
      <li>Child #2</li>
      <li disabled>Child #3</li>
    </ul>,
  ),
);

Deno.test(
  `${TEST_GROUP} - nested children`,
  assertCutoutJsxSnapshot(
    <div>
      <div>
        <div>
          <div>
            <div>
              Hello, World!
            </div>
          </div>
        </div>
      </div>
    </div>,
  ),
);

Deno.test(
  `${TEST_GROUP} - nested children + props`,
  assertCutoutJsxSnapshot(
    <div id="1">
      <div id="2">
        <div id="3" onClick={() => console.log("Hello from id #3!")}>
          <div id="4">
            <div id="5">
              Hello, World!
            </div>
          </div>
        </div>
      </div>
    </div>,
  ),
);

Deno.test(
  `${TEST_GROUP} - fragment`,
  assertCutoutJsxSnapshot(
    <>
      <span>Hello #1</span>
      <span>Hello #2</span>
    </>,
  ),
);

Deno.test(
  `${TEST_GROUP} - custom element`,
  (test) => {
    const MyElement = ({ hello }: { hello: string }) => <div>{hello}</div>;

    assertCutoutJsxSnapshot(
      <MyElement hello="Hello, Daniel!" />,
    )(test);
  },
);

function assertCutoutJsxSnapshot([, generator]: CutoutGeneratorToken) {
  return async (test: Deno.TestContext) =>
    await assertSnapshot(test, [...generator]);
}
