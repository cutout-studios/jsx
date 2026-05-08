/// <reference lib="dom" />

import type { CutoutElementFunction } from "@cutout/jsx";
import type { CutoutGeneratorToken } from "@cutout/jsx/tokens";

import { dom } from "../../format/dom/module.ts";
import {
  getCallerLocation,
  parseRawValue,
} from "../common.ts";
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

  const _stylesheet = Array.isArray(definition.stylesheet)
    ? definition.stylesheet
    : [definition.stylesheet!];

  const observedAttributes = Array.from(new Set(Object.keys(definition?.attributes ?? {})));

  const element = class extends HTMLElement {
    static observedAttributes = observedAttributes;

    #pendingAttributeChange?: number;
    #eventController = new AbortController();
    #isRendering = false;

    get observedAttributes(): ShapeFromDefinition<D> {
      return observedAttributes.reduce((result, attributeName) => ({
        ...result,
        [attributeName]: parseRawValue(
          this.getAttribute(attributeName)!,
          definition.attributes![attributeName],
        ),
      }), {} as ShapeFromDefinition<D>);
    }

    async connectedCallback() {
      await definition.connectedCallback?.();
      this.#doRender();
    }

    async attributeChangedCallback(
      name: string,
      oldValue: unknown,
      newValue: unknown,
    ) {
      clearInterval(this.#pendingAttributeChange);

      // TODO: do we even want to expose this? They may want to skip the render.
      await definition.attributeChangedCallback?.(name, oldValue, newValue);

      // Defer render until the current render is completed.
      this.#pendingAttributeChange = setInterval(() => {
        if (this.#isRendering) return;

        clearInterval(this.#pendingAttributeChange);
        this.#doRender();
      }, 60); // TODO: requestAnimationFrame loop?
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

        for (const rule of _stylesheet) {
          stylesheet.insertRule(rule.cssText);
        }

        this.shadowRoot!.adoptedStyleSheets = [stylesheet];
      }

      globalThis.requestAnimationFrame(
        () => {
          this.shadowRoot!.replaceChildren(
            ...Array.from(
              dom(templateRender(this.observedAttributes), {
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
    // TODO: gather sub-elements?
    dependencies: _stylesheet
  });
}
