/** @jsxImportSourceTypes @cutout/web/format/dom */

import { createElement } from "@cutout/web";

export default createElement("home", {
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
