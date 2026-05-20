import "@cutout/web/polyfill";

import { assert } from "@std/assert";
import { assertSnapshot } from "@std/testing/snapshot";
import { registerElement } from "./element.ts";
import { BaseRegistry as Registry } from "./registry/base.ts";
import { registerRoute } from "./route.ts";
import { registerStyle } from "./style.ts";

const TEST_GROUP = "web/registry";

// TODO(#): Server instance will generate its own registry, if one is not provided
Deno.test(`${TEST_GROUP} - compose style, element, and route`, async (test) => {
  const testRegistry = new Registry();
  const redText = registerStyle(/* css */ `:host { color: red; }`, {
    registry: testRegistry,
  });
  const Greeting = registerElement("greeting", {
    registry: testRegistry,
    tagPrefix: "test",
    definition: {
      name: String,
    },
    stylesheet: [redText],
    render({ name = "World" }) {
      return <h2>Hello, {name}!</h2>;
    },
  });

  const greetingPage = registerRoute("/greet/:name", {
    registry: testRegistry,
    definition: {
      name: String,
    },
    render({ name = "World" }) {
      return (
        <html>
          <head>
            <title>Hello, {name}!</title>
          </head>
          <body>
            <Greeting name={name} />
          </body>
        </html>
      );
    },
  });

  assert(testRegistry.get(":host{color:red;}"));
  assert(testRegistry.get("test-greeting"));
  assert(testRegistry.get("/greet/:name"));

  await assertSnapshot(
    test,
    await (await greetingPage.handler(
      new Request("https://example.org/greet/Test"),
      new URLPattern({ pathname: "/greet/:name" }).exec(
        "https://example.org/greet/Test",
      )!,
    )).text(),
  );
});

Deno.test(`${TEST_GROUP} - registerRoute, given messy route path`, () => {
  const testRegistry = new Registry();

  registerRoute("///user //:id/", {
    registry: testRegistry,
    definition: {
      id: Number,
    },
    render({ id }) {
      return <span>{id}</span>;
    },
  });

  assert(testRegistry.get("/user%20/:id"));
});

Deno.test(`${TEST_GROUP} - registerStyle, given messy CSS`, () => {
  const testRegistry = new Registry();

  registerStyle(
    `:host {
      all: initial;
      font-family: system;
      all: unset;
      font-family:
      font-family: system-ui;
    }
    typo`,
    { registry: testRegistry },
  );

  const sanitizedStyleRule = ":host{all:unset;font-family:system-ui;}";

  assert(testRegistry.get(sanitizedStyleRule));
});
