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
      all: unset;
      font-family: system-ui;
    }
  `,
    { registry: testRegistry },
  );

  const sanitizedStyleRule = ":host{all:unset;font-family:system-ui;}";

  assert(testRegistry.get(sanitizedStyleRule));
});
