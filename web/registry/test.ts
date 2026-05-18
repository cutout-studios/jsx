import "@cutout/polyfill";

import { assert } from "@std/assert";
import { BaseRegistry } from "./base.ts";
import { registerStyle } from "./entries/style.ts";

const TEST_GROUP = "web/registry";

// TODO: test registerRoute

Deno.test(`${TEST_GROUP} - registerStyle`, () => {
  const testRegistry = new BaseRegistry();

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
  const testRegistry = new BaseRegistry();

  registerStyle(
    `
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

// TODO: test registerElement
