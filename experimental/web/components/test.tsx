import "@cutout/internal/polyfill";

import { assertEquals } from "@std/assert";
import { assertSnapshot } from "@std/testing/snapshot";
import { createElement } from "./element.ts";
import { createEndpoint } from "./endpoint.ts";
import { createStyle } from "./style.ts";

const TEST_GROUP = "web/registry";

Deno.test(`${TEST_GROUP} - compose style, element, and route`, async (test) => {
  const redText = createStyle(/* css */ `:host { color: red; }`);
  const Greeting = createElement("greeting", {
    tagPrefix: "test",
    type: {
      name: String,
    },
    stylesheet: [redText],
    render({ name = "World" }) {
      return <h2>Hello, {name}!</h2>;
    },
  });

  const greetingPage = createEndpoint("/greet/:name", {
    type: {
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
  const endpoint = createEndpoint("///user //:id/", {
    type: {
      id: Number,
    },
    render({ id }) {
      return <span>{id}</span>;
    },
  });

  assertEquals(endpoint.name, "/user%20/:id");
});
