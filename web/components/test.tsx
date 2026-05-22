import "@cutout/web/polyfill";

import { assert, assertEquals } from "@std/assert";
import { assertSnapshot } from "@std/testing/snapshot";
import { V8CallSite } from "./callsite.ts";
import { CALLSITE_OVERWRITTEN_MESSAGE } from "./constants.ts";
import { registerElement } from "./element.ts";
import { BaseRegistry as Registry } from "./registry/base.ts";
import { registerRoute } from "./route.ts";
import { registerStyle } from "./style.ts";

const TEST_GROUP = "web/registry";

Deno.test(`${TEST_GROUP} - V8CallSite, stack formatting is overwritten`, () => {
  assert(new V8CallSite().stack?.includes(CALLSITE_OVERWRITTEN_MESSAGE));
});

Deno.test(`${TEST_GROUP} - V8CallSite, non-V8CallSite stack formatting is preserved`, () => {
  void new V8CallSite();

  assert(!new Error().stack?.includes(CALLSITE_OVERWRITTEN_MESSAGE));
});

Deno.test(`${TEST_GROUP} - V8CallSite.getParent`, () => {
  function test1() {
    function test2() {
      function test3() {
        assertEquals(
          V8CallSite.getParent()?.getFunctionName(),
          "test2",
        );
      }

      test3();
    }

    test2();
  }

  test1();
});

// TODO(@cutout/web/server): Server instance will generate its own registry, if one is not provided
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
