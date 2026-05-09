/// <reference lib="dom" />

import type { CutoutElementFunction } from "@cutout/jsx";
import type { CutoutGeneratorToken } from "@cutout/jsx/tokens";

import { dom } from "../../format/dom/module.ts";
import { getCallerLocation, parseRawValue } from "../common.ts";
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
  stylesheet?: CSSRule | CSSRule[];
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
    <template shadowRootMode="open" data-xo-location={getCallerLocation()}>
      {render(attributes)}
    </template>
  );

  const _stylesheet = Array.isArray(definition.stylesheet)
    ? definition.stylesheet
    : [definition.stylesheet!];

  const observedAttributes = Array.from(
    new Set(Object.keys(definition?.attributes ?? {})),
  );

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

      await definition.attributeChangedCallback?.(name, oldValue, newValue);

      // Defer render until the current render is completed.
      const tick = () => {
        if (this.#isRendering) {
          this.#pendingAttributeChange = requestAnimationFrame(tick);
          return;
        }

        if (typeof this.#pendingAttributeChange !== "undefined") {
          cancelAnimationFrame(this.#pendingAttributeChange);
        }

        this.#doRender();
      };

      this.#pendingAttributeChange = requestAnimationFrame(tick);
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

      // TODO: preserve focus, scroll - walk the current tree, note which elements do and do not have
      // scroll/focus, make best effort selectors (id -> key -> nth-child), then attempt reapply after tree has been
      // re-added.
      globalThis.requestAnimationFrame(
        () => {
          // TODO(#56): bind stores
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
    { dsd = true, registry = globalThis.customElements }
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

  return result;
}
