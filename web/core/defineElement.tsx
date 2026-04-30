import { dom } from "./format/dom/main.ts";

import type { CutoutElementFunction } from "@cutout/jsx";

// TODO: improve these, as well as value resolution.
type CutoutWebElementAttributesDefinition = Record<string, object>;
type CutoutWebElementAttributes = Record<string, unknown>;

interface CutoutWebElementDefinition<
  D extends CutoutWebElementAttributesDefinition,
> {
  connectedCallback?: () => void;
  // TODO: better args
  attributeChangedCallback?: () => void;
  disconnectedCallback?: () => void;
  stylesheet: CSSStyleSheet;
  render?: CutoutElementFunction<CutoutWebElementAttributes>;
  attributes?: D;
}

export function defineElement<D extends CutoutWebElementAttributesDefinition>(
  name: string,
  config: CutoutWebElementDefinition<D>,
) {
  const templateRender = (attributes: D) => (
    <template shadowRootMode="open">
      {(config.render ?? (() => <slot></slot>))(attributes)}
    </template>
  );

  const element = class extends HTMLElement {
    static observedAttributes = Object.keys(config?.attributes ?? {});

    #eventController = new AbortController();

    constructor() {
      super();

      // TODO: make sure this accounts for existing properties via Reflect
      return new Proxy(this, {
        get: (self, key) => {
          if (key in (config.attributes ?? {})) {
            return self.getAttribute(String(key));
          }
        },
        set: (self, key, value) => {
          if (key in (config.attributes ?? {})) {
            self.setAttribute(String(key), value);
            return true;
          }

          return false;
        },
        // TODO: deleteProperty
      });
    }

    fetchPartial() {
      // TODO: we need to track each fetch, return `undefined`
      // if it's triggered, and then #doRender when it's loaded.
    }

    connectedCallback() {
      requestAnimationFrame(
        () => {
          config.connectedCallback?.();
          this.#doRender();
        },
      );
    }

    // TODO: better type args
    attributeChangedCallback(...args: []) {
      requestAnimationFrame(
        () => {
          config.attributeChangedCallback?.(...args);
          this.#doRender();
        },
      );
    }

    disconnectedCallback() {
      config.disconnectedCallback?.();

      this.#eventController.abort();
    }

    #doRender() {
      if (!this.shadowRoot) {
        this.attachShadow({ mode: "open" });
      }

      this.shadowRoot!.adoptedStyleSheets = [config.stylesheet];
      this.shadowRoot!.replaceChildren(
        // TODO: dom needs to take the abort controller
        ...Array.from(
          dom(
            (config.render ?? (() => <slot></slot>))(
              this as CutoutWebElementAttributes,
            ),
          ),
        ),
      );
      this.shadowRoot!.appendChild(this.shadowRoot!.cloneNode(true));
    }
  };

  if (!customElements.get(name)) {
    customElements.define(name, element);
  } // TODO: warn if already defined

  const _ = { name };
  return (attributes: D) => (
    <_.name {...attributes}>
      {/* TODO: merge rules? polyfill */}
      {Array.from(config.stylesheet.cssRules).map((rule) => (
        <style>{rule.cssText}</style>
      ))}
      {templateRender(attributes)}
    </_.name>
  );
}
