/** @jsxImportSourceTypes @cutout/web/format/dom */

import { createElement } from "@cutout/web";

export const AppHome = createElement("home", {
  attributes: {
    username: String,
  },
  render({ username = "World" }) {
    return (
      <main>
        <h1>Hello, {username}!</h1>
      </main>
    );
  },
});
