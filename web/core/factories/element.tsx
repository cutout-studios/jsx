import type { CutoutElementFunction } from "@cutout/jsx";

import { dom } from "../../format/dom/main.ts";
import { CutoutErrorCode } from "../errors/module.ts";
import { CutoutError } from "../errors/module.ts";
import type { ShapeDefinition, ShapeFromDefinition } from "../types.ts";

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

// TODO(#51): nested attribute definitions
export function createElement<D extends ShapeDefinition>(
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

  // TODO(#51): nested attribute definitions
  // => Note: the Proxy will have to return sub-proxy objects.
  const observedAttributes = new Set(Object.keys(definition?.attributes ?? {}));

  const element = class extends HTMLElement {
    static observedAttributes = observedAttributes;

    #eventController = new AbortController();

    constructor() {
      super();

      return new Proxy(this, {
        get: (self, key) => {
          key = String(key);

          if (Reflect.has(self, key)) {
            return Reflect.get(self, key);
          }

          if (observedAttributes.has(key)) {
            return self.getAttribute(String(key));
          }
        },
        set: (self, key, value) => {
          key = String(key);

          if (Reflect.has(self, key)) {
            return Reflect.defineProperty(self, key, value);
          }

          if (observedAttributes.has(key)) {
            self.setAttribute(String(key), value);
            return true;
          }

          return false;
        },
        deleteProperty: (self, key) => {
          key = String(key);

          if (Reflect.has(self, key)) {
            return Reflect.deleteProperty(self, key);
          }

          if (observedAttributes.has(key)) {
            self.removeAttribute(String(key));
            return true;
          }

          return false;
        },
      });
    }

    // TODO(#52): implement - we need to track each fetch, return `undefined`
    // if it's triggered, and then #doRender when it's loaded.
    // fetchPartial() {}

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

  const _ = { name };
  const result = (
    attributes: ShapeFromDefinition<D>,
    { dsd = true, registry = globalThis.customElements }: {
      dsd: boolean;
      registry: CustomElementRegistry;
    },
  ) => {
    if (!registry?.get(`xo-${name}`)) {
      registry.define(`xo-${name}`, element);
    } else {
      console.warn(
        new CutoutError(CutoutErrorCode.OPERATION_REDUNDANT, {
          context: `Registering xo-${name}.`,
        }).toString(),
      );
    }

    if (!dsd) {
      return <_.name {...attributes}></_.name>;
    }

    return (
      <_.name {...attributes}>
        <style>
          {/* TODO(#53): merge/manage DSD style rules */}
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
    // TODO: metadata for compiling imports and import map (hard)
    // => definitionFile: new URL(""),
  });
}
