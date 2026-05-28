import { assertEquals, assertThrows } from "@std/assert";
import { CSSStyleRule } from "./CSSStyleRule.ts";

const TEST_GROUP = "internal/polyfill";

Deno.test(`${TEST_GROUP} - CSSStyleRule`, () => {
  const result1 = new CSSStyleRule();

  result1.cssText = /* css */ `
    :host {
      all: initial;
      font-family: system-ui;
    }
  `;

  assertEquals(result1.selectorText, ":host");
  assertEquals(result1.styleMap.get("all"), "initial");
  assertEquals(result1.styleMap.get("font-family"), "system-ui");

  const result2 = new CSSStyleRule();

  result2.cssText = /* css */ `:not(i, em) { text-emphasis: none; }`;

  assertEquals(result2.selectorText, ":not(em, i)");
});

Deno.test(`${TEST_GROUP} - CSSStyleRule, handles messy CSS`, () => {
  const result = new CSSStyleRule();

  result.cssText = /* css */ `
      :host {
        all: unset;
              font-family: system;
        all: initial;font-family:;
        font-family: system-ui;
      }
    `;

  assertEquals(result.selectorText, ":host");
  assertEquals(result.styleMap.get("all"), "initial");
  assertEquals(result.styleMap.get("font-family"), "system-ui");
});

Deno.test(`${TEST_GROUP} - CSSStyleRule, throws invalid CSS`, () => {
  const result = new CSSStyleRule();

  assertThrows(() => {
    result.cssText = `
      :host {
        all: unset;
        font-family: system;
        all: initial;
        font-family: system-ui;
      }
      typo
    `;
  });

  assertThrows(() => {
    result.cssText = `
      :host {
        all:
        all: initial;
      }
    `;
  });

  assertThrows(() => result.cssText = `:host { all: initial; }`);
});

Deno.test(`${TEST_GROUP} - CSSStyleRule, content`, () => {
  const result1 = new CSSStyleRule();

  result1.cssText = /* css */ `
      :host {
        content: "{}";
      }
    `;

  assertEquals(result1.styleMap.get("content"), '"{}"');

  const result2 = new CSSStyleRule();
  result2.cssText = /* css */ `
      :host {
        content: "all: initial;";
      }
    `;

  assertEquals(result2.styleMap.get("content"), '"all: initial;"');
});

Deno.test(`${TEST_GROUP} - CSSStyleRule, no whitespace`, () => {
  const result = new CSSStyleRule();
  result.cssText = /* css */ `:host{all:initial;}`;

  assertEquals(result.selectorText, ":host");
  assertEquals(result.styleMap.get("all"), "initial");
});

Deno.test(`${TEST_GROUP} - CSSStyleRule, semantic whitespace`, () => {
  const result = new CSSStyleRule();
  result.cssText = /* css */ `
      :host {
        border: 1px solid black;
      }
    `;

  assertEquals(result.styleMap.get("border"), "1px solid black");
});

Deno.test(`${TEST_GROUP} - CSSStyleRule, sorting`, () => {
  const result = new CSSStyleRule();
  result.cssText = /* css */ `
      span.red, :host, :host * > :first-child {
        font-family: system-ui;
        color: red;
        text-overflow: ellipsis;
        text-align: center;
      }
    `;

  assertEquals(result.selectorText, ":host, :host * > :first-child, span.red");

  const propertyKeyArray: string[] = [];

  result.styleMap.forEach((property) => propertyKeyArray.push(property));

  assertEquals(propertyKeyArray[0], "color");
  assertEquals(propertyKeyArray[1], "font-family");
  assertEquals(propertyKeyArray[2], "text-align");
  assertEquals(propertyKeyArray[3], "text-overflow");
});
