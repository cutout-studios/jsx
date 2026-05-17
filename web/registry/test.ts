import "@cutout/polyfill";

import { assert } from "@std/assert";
import { Registry } from "./base.ts";
import { registerStyle } from "./style.ts";

const TEST_GROUP = "web/registry";

Deno.test(`${TEST_GROUP} - registerStyle`, () => {
  const testRegistry = new Registry();

  registerStyle(
    /* css */ `
    :host {
      font-family: system-ui;
      all: unset;
    }
  `,
    { registry: testRegistry },
  );

  const sanitizedStyleRule = ":host{all:unset;font-family:system-ui;}";

  assert(testRegistry.get(sanitizedStyleRule));
});

Deno.test(`${TEST_GROUP} - registerStyle, given messy CSS`, () => {
  const testRegistry = new Registry();

  registerStyle(`
    :host {
      all: initial;
      font-family: system;
      all: unset;
      font-family:
      font-family: system-ui;
    }
    typo
  `,
    { registry: testRegistry },
  );

  const sanitizedStyleRule = ":host{all:unset;font-family:system-ui;}";

  assert(testRegistry.get(sanitizedStyleRule));
});
