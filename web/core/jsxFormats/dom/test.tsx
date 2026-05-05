/** @jsxImportSource @cutout/jsx */
/** @jsxImportSourceTypes @cutout/web/format/dom */

import { assertSnapshot } from "@std/testing/snapshot";
import { Window } from "happy-dom";
import { dom } from "./main.ts";

const TEST_GROUP = "format/dom";

domTest(`${TEST_GROUP} - simple element`, async (test) => {
  await assertSnapshot(test, dom(<div></div>)[0].outerHTML);
});

domTest(`${TEST_GROUP} - nested elements`, async (test) => {
  await assertSnapshot(
    test,
    dom(
      <div>
        <span>Test</span>
      </div>,
    )[0].outerHTML,
  );
});

domTest(`${TEST_GROUP} - attributes`, async (test) => {
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
});

domTest(`${TEST_GROUP} - boolean attributes`, async (test) => {
  await assertSnapshot(
    test,
    dom(
      <input type="checkbox" checked disabled />,
    )[0].outerHTML,
  );
});

domTest(`${TEST_GROUP} - fragment`, async (test) => {
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
});

// utils
function domTest(
  name: string,
  testFunc: (test: Deno.TestContext) => Promise<void>,
): void {
  Deno.test(name, async (test) => {
    const nativeDocument = globalThis.document;
    const window = new Window();
    Object.assign(globalThis, { document: window.document });

    try {
      await testFunc(test);
    } finally {
      await window.happyDOM.waitUntilComplete();
      Object.assign(globalThis, { document: nativeDocument });
      window.close();
    }
  });
}
