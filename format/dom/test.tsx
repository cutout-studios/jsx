/** @jsxImportSource @cutout/jsx */
/** @jsxImportSourceTypes @cutout/jsx/format/dom */

import { assertSnapshot } from "@std/testing/snapshot";
import { Window } from "happy-dom";
import { dom } from "./main.ts";

Deno.test("element - simple element", async (test) => {
  await withDOM(() => assertSnapshot(test, dom(<div></div>)[0].outerHTML));
});

Deno.test("element - nested elements", async (test) => {
  await withDOM(() =>
    assertSnapshot(
      test,
      dom(
        <div>
          <span>Test</span>
        </div>,
      )[0].outerHTML,
    )
  );
});

Deno.test("element - attributes", async (test) => {
  await withDOM(() => {
    const style = document.createElement("span").style as CSSStyleDeclaration;

    style.setProperty("color", "red");

    return assertSnapshot(
      test,
      dom(
        <div
          id="test"
          style={style}
          dataset={{ value: "123" }}
        >
          Test
        </div>,
      )[0].outerHTML,
    );
  });
});

Deno.test("element - boolean attributes", async (test) => {
  await withDOM(() =>
    assertSnapshot(
      test,
      dom(
        <input type="checkbox" checked disabled />,
      )[0].outerHTML,
    )
  );
});

Deno.test("element - fragment", async (test) => {
  await withDOM(() => {
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

    return assertSnapshot(
      test,
      result,
    );
  });
});

async function withDOM(
  test: () => Promise<void>,
): Promise<void> {
  const window = new Window();
  const document = window.document as unknown as Document;

  const originalDocument = globalThis.document;
  globalThis.document = document;

  try {
    return await test();
  } finally {
    globalThis.document = originalDocument;
    window.close();
  }
}
