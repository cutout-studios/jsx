/** @jsxImportSource @cutout/jsx */

import { assertSnapshot } from "@std/testing/snapshot";
import { html } from "./main.ts";

const TEST_GROUP = "html";

Deno.test(`${TEST_GROUP} - simple case`, (test) =>
  assertSnapshot(test, html(<div></div>)));

Deno.test(
  `${TEST_GROUP} - props`,
  (test) =>
    assertSnapshot(
      test,
      html(<div style={{ color: "red" }} id="my-cool-div"></div>),
    ),
);

Deno.test(
  `${TEST_GROUP} - children`,
  (test) =>
    assertSnapshot(
      test,
      html(
        <ul>
          <li>Child #1</li>
          <li>Child #2</li>
          <li>Child #3</li>
        </ul>,
      ),
    ),
);

Deno.test(
  `${TEST_GROUP} - mapped children`,
  (test) =>
    assertSnapshot(
      test,
      html(
        <ul>
          {["Child #1", "Child #2", "Child #3"].map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>,
      ),
    ),
);

Deno.test(
  `${TEST_GROUP} - children + props`,
  (test) =>
    assertSnapshot(
      test,
      html(
        <ul id="main">
          <li class="selected">Child #1</li>
          <li>Child #2</li>
          <li disabled>Child #3</li>
        </ul>,
      ),
    ),
);

Deno.test(
  `${TEST_GROUP} - nested children`,
  (test) =>
    assertSnapshot(
      test,
      html(
        <ul id="main">
          <li class="selected">Child #1</li>
          <li>Child #2</li>
          <li disabled>Child #3</li>
        </ul>,
      ),
    ),
);

Deno.test(
  `${TEST_GROUP} - nested children`,
  (test) =>
    assertSnapshot(
      test,
      html(
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
    ),
);

Deno.test(
  `${TEST_GROUP} - nested children + props`,
  (test) =>
    assertSnapshot(
      test,
      html(
        <div id="1">
          <div id="2">
            <div id="3">
              <div id="4">
                <div id="5">
                  Hello, World!
                </div>
              </div>
            </div>
          </div>
        </div>,
      ),
    ),
);

Deno.test(
  `${TEST_GROUP} - void element`,
  (test) =>
    assertSnapshot(
      test,
      html(<input type="text" />),
    ),
);

Deno.test(`${TEST_GROUP} - fragment`, (test) =>
  assertSnapshot(
    test,
    html(
      <>
        <span>Hello #1</span>
        <span>Hello #2</span>
      </>,
    ),
  ));
