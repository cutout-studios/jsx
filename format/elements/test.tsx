/** @jsxImportSource @cutout/jsx */

import { DOMParser } from "@b-fuze/deno-dom";
import { assertSnapshot } from "@std/testing/snapshot";
import { elements } from "./main.ts";

globalThis.document = new DOMParser().parseFromString(
  "<!DOCTYPE html><html><body></body></html>",
  "text/html",
) as unknown as Document;

Deno.test("element - simple element", async (test) => {
  await assertSnapshot(test, elements(<div></div>)[0].outerHTML);
});

Deno.test("element - nested elements", async (test) => {
  await assertSnapshot(
    test,
    elements(
      <div>
        <span>Test</span>
      </div>,
    )[0].outerHTML,
  );
});

Deno.test("element - attributes", async (test) => {
  await assertSnapshot(
    test,
    elements(
      <div id="test" style={{ color: "red" }} data-value="123">
        Test
      </div>,
    )[0].outerHTML,
  );
});

Deno.test("element - boolean attributes", async (test) => {
  await assertSnapshot(
    test,
    elements(
      <input type="checkbox" checked disabled />,
    )[0].outerHTML,
  );
});

Deno.test("element - fragment", async (test) => {
  await assertSnapshot(
    test,
    elements(
      <>
        <div>First</div>
        <div>Second</div>
      </>,
    )[0].outerHTML,
  );
});
