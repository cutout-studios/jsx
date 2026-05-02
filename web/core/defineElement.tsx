import { dom } from "./format/dom/main.ts";

import type { CutoutElementFunction } from "@cutout/jsx";
import type { ShapeDefinition, ShapeFromDefinition } from "./types.ts";

interface ElementDefinition<
  D extends ShapeDefinition,
> {
  connectedCallback?: () => void | Promise<void>;
  attributeChangedCallback?: (
    name: string,
    oldValue: unknown,
    newValue: unknown,
  ) => void | Promise<void>;
  disconnectedCallback?: () => void | Promise<void>;
  stylesheet?: CSSStyleSheet;
  render?: CutoutElementFunction<ShapeFromDefinition<D>>;
  attributes?: D;
}

// TODO: full API coverage
export function defineElement<D extends ShapeDefinition>(
  name: string,
  {
    render = () => <slot></slot>,
    ...definition
  }: ElementDefinition<D>,
) {
  const templateRender = (attributes: ShapeFromDefinition<D>) => (
    <template shadowRootMode="open">
      {render(attributes)}
    </template>
  );

  // TODO: flatten attributes into dot syntax
  //   Note: the Proxy will have to return sub-proxy objects.
  const observedAttributes = new Set(Object.keys(definition?.attributes ?? {}));

  const element = class extends HTMLElement {
    static observedAttributes = observedAttributes;

    #eventController = new AbortController();

    constructor() {
      super();

      // TODO(!): make sure this accounts for existing properties via Reflect
      //   and parses incoming/outgoing values
      return new Proxy(this, {
        get: (self, key) => {
          key = String(key);

          if (observedAttributes.has(key)) {
            return self.getAttribute(String(key));
          }
        },
        set: (self, key, value) => {
          key = String(key);

          if (observedAttributes.has(key)) {
            self.setAttribute(String(key), value);
            return true;
          }

          return false;
        },
        deleteProperty: (self, key) => {
          key = String(key);

          if (observedAttributes.has(key)) {
            self.removeAttribute(String(key));
            return true;
          }

          return false;
        },
      });
    }

    // fetchPartial() {
    //   TODO: we need to track each fetch, return `undefined`
    //   if it's triggered, and then #doRender when it's loaded.
    // }

    connectedCallback() {
      requestAnimationFrame(
        async () => {
          await definition.connectedCallback?.();
          this.#doRender();
        },
      );
    }

    attributeChangedCallback(
      name: string,
      oldValue: unknown,
      newValue: unknown,
    ) {
      requestAnimationFrame(
        async () => {
          await definition.attributeChangedCallback?.(name, oldValue, newValue);
          this.#doRender();
        },
      );
    }

    async disconnectedCallback() {
      await definition.disconnectedCallback?.();

      this.#eventController.abort();
    }

    #doRender() {
      if (!this.shadowRoot) {
        this.attachShadow({ mode: "open" });
      }

      if (definition.stylesheet) {
        this.shadowRoot!.adoptedStyleSheets = [definition.stylesheet];
      }

      this.shadowRoot!.replaceChildren(
        ...Array.from(
          dom(render(this as ShapeFromDefinition<D>), {
            event: { signal: this.#eventController.signal },
          }),
        ),
      );
      this.shadowRoot!.appendChild(this.shadowRoot!.cloneNode(true));
    }
  };

  if (!globalThis.customElements?.get(`xo-${name}`)) {
    globalThis.customElements.define(`xo-${name}`, element);
  } else {
    // TODO: warning system (like error system)
    console.warn(`${name} already defined.`);
  }

  const _ = { name };
  const result = (
    attributes: ShapeFromDefinition<D>,
    { dsd = true }: { dsd: boolean },
  ) => {
    if (!dsd) {
      return <_.name {...attributes}></_.name>;
    }

    return (
      <_.name {...attributes}>
        <style>
          {/* TODO: merge rules? */}
          {Array.from(definition.stylesheet?.cssRules ?? []).map((rule) =>
            rule.cssText
          ).join("\n")}
        </style>
        {templateRender(attributes)}
      </_.name>
    );
  };

  return Object.assign(result, {
    name,
    // TODO: SSR metadata
    // definitionFile: new URL(""),
    // dependencies: ...
  });
}
