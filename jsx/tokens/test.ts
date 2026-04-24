import { assertEquals } from "@std/assert";
import { isValidCutoutToken, tokenizeValue } from "./module.ts";
import { CutoutTokenType } from "./types.ts";

Deno.test("isValidCutoutToken - spot check", () => {
  assertEquals(
    isValidCutoutToken([CutoutTokenType.NUMBER, 0]),
    true,
  );
  assertEquals(
    isValidCutoutToken([CutoutTokenType.STRING, "string"]),
    true,
  );
  assertEquals(
    isValidCutoutToken([CutoutTokenType.BOOLEAN, false]),
    true,
  );
  assertEquals(isValidCutoutToken([CutoutTokenType.ARRAY, []]), true);
  assertEquals(isValidCutoutToken([CutoutTokenType.OBJECT, {}]), true);
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
  assertEquals(tokenizeValue(0), [CutoutTokenType.NUMBER, 0]);
  assertEquals(tokenizeValue("value"), [CutoutTokenType.STRING, "value"]);
  assertEquals(tokenizeValue(null), [CutoutTokenType.NULL, null]);
  assertEquals(tokenizeValue(undefined), [
    CutoutTokenType.UNDEFINED,
    undefined,
  ]);

  const array: unknown[] = [];
  assertEquals(tokenizeValue(array), [CutoutTokenType.ARRAY, array]);

  const object = {};
  assertEquals(tokenizeValue(object), [CutoutTokenType.OBJECT, object]);

  const func = () => {};
  assertEquals(tokenizeValue(func), [CutoutTokenType.FUNCTION, func]);
});
