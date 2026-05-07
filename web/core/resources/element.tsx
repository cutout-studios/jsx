/// <reference lib="dom" />

import type { CutoutElementFunction } from "@cutout/jsx";
import type { CutoutGeneratorToken } from "@cutout/jsx/tokens";

import { dom } from "../../format/dom/main.ts";
import { getCallerLocation, parseRawValue } from "../common.ts";
import { CutoutErrorCode } from "../errors/module.ts";
import { CutoutError } from "../errors/module.ts";
import type {
  ElementResource,
  ElementResourceOptions,
  ShapeDefinition,
  ShapeFromDefinition,
  StyleResource,
} from "../types.ts";

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
  stylesheet?: StyleResource | StyleResource[];
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
): ElementResource<D> {
  const templateRender = (attributes: ShapeFromDefinition<D>) => (
    <template shadowRootMode="open">
      {render(attributes)}
    </template>
  );

  // TODO(#51): nested attribute definitions
  // => Note: the Proxy will have to return sub-proxy objects.
  const observedAttributes = new Set(Object.keys(definition?.attributes ?? {}));

  const element = class extends HTMLElement {
    static observedAttributes = Array.from(observedAttributes);

    #eventController = new AbortController();
    #isRendering = false;

    constructor() {
      super();

      return new Proxy(this, {
        get: (self, key) => {
          key = String(key);

          if (Object.hasOwn(self, key)) {
            return parseRawValue(
              String(Reflect.get(self, key)),
              definition.attributes![key],
            );
          }

          if (observedAttributes.has(key)) {
            return parseRawValue(
              self.getAttribute(String(key))!,
              definition.attributes![key],
            );
          }

          return undefined;
        },
        set: (self, key, value) => {
          if (this.#isRendering) {
            console.warn(
              new CutoutError(CutoutErrorCode.OPERATION_READONLY, {
                context: { name, key, value },
                guidance:
                  "Move data management outside of the element render loop.",
              }).toString(),
            );

            return true;
          }

          key = String(key);

          if (Object.hasOwn(self, key)) {
            Reflect.set(self, key, value);
          }

          if (observedAttributes.has(key)) {
            self.setAttribute(String(key), value);
          }

          return true;
        },
        deleteProperty: (self, key) => {
          if (this.#isRendering) {
            console.warn(
              new CutoutError(CutoutErrorCode.OPERATION_READONLY, {
                context: { name, key },
                guidance:
                  "Move data management outside of the element render loop.",
              }).toString(),
            );

            return true;
          }

          key = String(key);

          if (Object.hasOwn(self, key)) {
            Reflect.deleteProperty(self, key);
          }

          if (observedAttributes.has(key)) {
            self.removeAttribute(String(key));
          }

          return true;
        },
      });
    }

    // TODO(#52): implement - we need to track each fetch, return `undefined`
    // if it's triggered, and then #doRender when it's loaded.
    // fetchPartial() {}

    async connectedCallback() {
      await definition.connectedCallback?.();
      this.#doRender();
    }

    async attributeChangedCallback(
      name: string,
      oldValue: unknown,
      newValue: unknown,
    ) {
      await definition.attributeChangedCallback?.(name, oldValue, newValue);
      this.#doRender();
    }

    async disconnectedCallback() {
      await definition.disconnectedCallback?.();
      this.#eventController.abort();
    }

    #doRender() {
      if (this.#isRendering) return;

      this.#isRendering = true;

      if (!this.shadowRoot) {
        this.attachShadow({ mode: "open" });
      }

      if (definition.stylesheet) {
        const stylesheet = new CSSStyleSheet();

        for (
          const rule of Array.isArray(definition.stylesheet)
            ? definition.stylesheet
            : [definition.stylesheet]
        ) {
          stylesheet.insertRule(rule.cssText);
        }

        this.shadowRoot!.adoptedStyleSheets = [stylesheet];
      }

      globalThis.requestAnimationFrame(
        () => {
          this.shadowRoot!.replaceChildren(
            ...Array.from(
              dom(templateRender(this as ShapeFromDefinition<D>), {
                event: { signal: this.#eventController.signal },
              }),
            ),
          );
          this.shadowRoot!.appendChild(this.shadowRoot!.cloneNode(true));
          this.#isRendering = false;
        },
      );
    }
  };

  const _ = { name };
  const result = (
    attributes: ShapeFromDefinition<D>,
    { dsd = true, registry = globalThis.customElements }:
      | ElementResourceOptions
      | undefined = {},
  ): CutoutGeneratorToken => {
    if (!registry?.get(`xo-${name}`)) {
      registry.define(`xo-${name}`, element);
    } else {
      console.warn(
        new CutoutError(CutoutErrorCode.OPERATION_REDUNDANT, {
          context: `Registering \`xo-${name}.\``,
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
          {(Array.isArray(definition.stylesheet)
            ? definition.stylesheet
            : [definition.stylesheet]).map((rule) => rule?.cssText)
            .join("\n")}
        </style>
        {templateRender(attributes)}
      </_.name>
    );
  };

  return Object.assign(result, {
    location: getCallerLocation()!,
    // TODO: gather sub-elements
    dependencies: Array.isArray(definition.stylesheet)
      ? definition.stylesheet
      : [definition.stylesheet!],
  });
}
