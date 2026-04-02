
import { assert } from "@std/assert";
import { jsx } from "./module.ts";

Deno.test("jsx - simple case", () => {
  const emptyDiv = jsx("div", {});

  assert(emptyDiv.index);
  assert(emptyDiv.values);
});

Deno.test("jsx - props", () => {

});

Deno.test("jsx - children", () => {

});
