/** @jsxImportSource @cutout/jsx */
/** @jsxImportSourceTypes @cutout/jsx/format/dom */

import { dom } from "../../main.ts";
import { BaseElement } from "../app/base.ts";

export class ExampleElement extends BaseElement {
  static observedAttributes = ["color"];

  randomizeColor = () => {
    this.setAttribute(
      "color",
      `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    );
  };

  render({ color = "black" }) {
    return dom(
      <>
        <style>{/* css */ `h1 { color: ${color}; }`}</style>
        <h1>Hello, World!</h1>
        <button
          type="button"
          onclick={this.randomizeColor}
        >
          Randomize Color
        </button>
      </>,
    );
  }
}

customElements.define("example-element", ExampleElement);
