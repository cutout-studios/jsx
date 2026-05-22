import { assert, assertArrayIncludes, assertEquals } from "@std/assert";
import { parseCSSRule } from "./cssRule.ts";

const TEST_GROUP = "web/components/parse";

Deno.test(`${TEST_GROUP} - parseCSSRule`, () => {
  const result = parseCSSRule(
    /* css */`
    :host {
      all: initial;
      font-family: system-ui;
    }
  `);

  assertArrayIncludes(result?.selectors ?? [], [":host"]);
  assert(result?.properties.get("all"), "initial");
  assert(result?.properties.get("font-family"), "system-ui");
});

Deno.test(`${TEST_GROUP} - parseCSSRule, given messy CSS`, () => {
  const result = parseCSSRule(
    /* css */`
      :host {
        all: unset;
        font-family: system;
        all: initial;
        font-family:;
        font-family: system-ui;
      }
    `
  );

  assertArrayIncludes(result?.selectors ?? [], [":host"]);
  assert(result?.properties.get("all"), "initial");
  assert(result?.properties.get("font-family"), "system-ui");
});

Deno.test(`${TEST_GROUP} - parseCSSRule, given invalid CSS`, () => {
  const result1 = parseCSSRule(
    `
      :host {
        all: unset;
        font-family: system;
        all: initial;
        font-family:
        font-family: system-ui;
      }
      typo
    `
  );

  assertEquals(result1, undefined);

  const result2 = parseCSSRule(`:host,,, {}`);

  assertEquals(result2, undefined);

});

Deno.test(`${TEST_GROUP} - parseCSSRule, content`, () => {
  const result1 = parseCSSRule(
    /* css */`
      :host {
        content: "{}";
      }
    `
  );

  assert(result1?.properties.get("content"), '"{}"');

  const result2 = parseCSSRule(
    /* css */`
      :host {
        content: "all: initial;";
      }
    `
  );

  assert(result2?.properties.get("content"), '"all: initial;"');
});

Deno.test(`${TEST_GROUP} - parseCSSRule, no whitespace`, () => {
  const result = parseCSSRule(/* css */`:host{all:initial;}`);

  assertArrayIncludes(result?.selectors ?? [], [":host"]);
  assertArrayIncludes(Array.from(result?.properties.keys() ?? []), ["all"]);
});

Deno.test(`${TEST_GROUP} - parseCSSRule, semantic whitespace`, () => {
  const result = parseCSSRule(
    /* css */`
      :host {
        border: 1px solid black;
      }
    `
  );

  assertEquals(result?.properties.get("border"), "1px solid black");
});

Deno.test(`${TEST_GROUP} - parseCSSRule, sorting`, () => {
  const result = parseCSSRule(
    /* css */`
      span.red, :host, :host * > :first-child {
        font-family: system-ui;
        color: red;
        text-overflow: ellipsis;
        text-align: center;
      }
    `
  );

  assertEquals(result?.selectors[0], ":host");
  assertEquals(result?.selectors[1], ":host * > :first-child");
  assertEquals(result?.selectors[2], "span.red");

  const propertyKeyArray = Array.from(result?.properties.keys() ?? []);

  assertEquals(propertyKeyArray[0], "color");
  assertEquals(propertyKeyArray[1], "font-family");
  assertEquals(propertyKeyArray[2], "text-align");
  assertEquals(propertyKeyArray[3], "text-overflow");
});
