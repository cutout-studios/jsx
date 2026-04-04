import { assertEquals } from "@std/assert";
import { isValidCutoutToken, tokenizeValue } from "./module.ts";
import { CutoutTokenType } from "./types.ts";

Deno.test("isValidCutoutToken - spot check", () => {
  assertEquals(
    isValidCutoutToken([CutoutTokenType.STRING, "string"]),
    true,
  );
  assertEquals(isValidCutoutToken([CutoutTokenType.ARRAY, []]), true);
  assertEquals(
    isValidCutoutToken([CutoutTokenType.UNKNOWN, Symbol("anything")]),
    true,
  );

  assertEquals(isValidCutoutToken(null), false);
  assertEquals(isValidCutoutToken([CutoutTokenType.ARRAY, {}]), false);
  assertEquals(
    isValidCutoutToken([
      CutoutTokenType.STRING,
      "string",
      "something extra",
    ]),
    false,
  );
});

Deno.test("tokenizeValue - spot check", () => {
  assertEquals(tokenizeValue(null), [CutoutTokenType.NULL, null]);
  assertEquals(tokenizeValue("value"), [CutoutTokenType.STRING, "value"]);

  const object = {};
  assertEquals(tokenizeValue(object), [CutoutTokenType.OBJECT, object]);

  const func = () => {};
  assertEquals(tokenizeValue(func), [CutoutTokenType.FUNCTION, func]);
});
