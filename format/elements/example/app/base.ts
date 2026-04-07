import type { CutoutGeneratorToken } from "@cutout/jsx/tokens";
import { elements } from "../../main.ts";

export abstract class BaseElement extends HTMLElement {
  abstract render(props: Record<string, unknown>): CutoutGeneratorToken;

  connectedCallback = this.#doRender;
  attributeChangedCallback = this.#doRender;

  get #attributes(): Record<string, unknown> {
    return new Proxy({}, {
      get: (_, name) => this.getAttribute(String(name)),
    });
  }

  #doRender() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
    }

    this.shadowRoot!.replaceChildren(
      ...Array.from(elements(this.render(this.#attributes))),
    );
  }
}
