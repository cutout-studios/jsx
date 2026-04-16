/** @jsxImportSource @cutout/jsx */
/** @jsxImportSourceTypes @cutout/jsx/format/dom */

import { assertSnapshot } from "@std/testing/snapshot";
import { Window } from "happy-dom";
import { dom } from "./main.ts";

const TEST_GROUP = "format/dom";

Deno.test(`${TEST_GROUP} - simple element`, async (test) => {
  const { setup, teardown } = createDOM();

  setup();

  await assertSnapshot(test, dom(<div></div>)[0].outerHTML);

  teardown();
});

Deno.test(`${TEST_GROUP} - nested elements`, async (test) => {
  const { setup, teardown } = createDOM();

  setup();

  await assertSnapshot(
    test,
    dom(
      <div>
        <span>Test</span>
      </div>,
    )[0].outerHTML,
  );

  teardown();
});

Deno.test(`${TEST_GROUP} - attributes`, async (test) => {
  const { setup, teardown } = createDOM();

  setup();

  const style = document.createElement("span").style as CSSStyleDeclaration;
  style.setProperty("color", "red");

  const classList = document.createElement("span").classList as DOMTokenList;
  classList.add("my-cool-class");

  await assertSnapshot(
    test,
    dom(
      <div
        id="test"
        style={style}
        classlist={classList}
        dataset={{ value: "123" }}
      >
        Test
      </div>,
    )[0].outerHTML,
  );

  teardown();
});

Deno.test(`${TEST_GROUP} - boolean attributes`, async (test) => {
  const { setup, teardown } = createDOM();

  setup();

  await assertSnapshot(
    test,
    dom(
      <input type="checkbox" checked disabled />,
    )[0].outerHTML,
  );

  teardown();
});

Deno.test(`${TEST_GROUP} - escape`, async (test) => {
  const { setup, teardown } = createDOM();

  setup();

  await assertSnapshot(
    test,
    dom(
      <iframe srcdoc="<script>alert('xss');</script>"></iframe>
    )
  )

  teardown();
})

Deno.test(`${TEST_GROUP} - fragment`, async (test) => {
  const { setup, teardown } = createDOM();

  setup();
  const collection = dom(
    <>
      <div>First</div>
      <div>Second</div>
    </>,
  );

  let result = "";

  for (let i = 0; i < collection.length; i++) {
    result += collection[i].outerHTML;
  }

  await assertSnapshot(
    test,
    result,
  );

  teardown();
});

// utils
// TODO: this doesn't work
function createDOM() {
  let window: Window;
  const nativeDocument = globalThis.document;

  return {
    setup() {
      window = new Window();
      const testDocument = window.document;
      Object.assign(globalThis, { document: testDocument });
    },
    teardown() {
      Object.assign(globalThis, { document: nativeDocument });
      window?.close();
    },
  };
}
