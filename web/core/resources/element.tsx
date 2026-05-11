/// <reference lib="dom" />

import type { CutoutElementFunction } from "@cutout/jsx";
import type { CutoutGeneratorToken } from "@cutout/jsx/tokens";

import { dom } from "../../format/dom/module.ts";
import { getParentCallerLocation, parseRawValue } from "../common.ts";
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
  const callerLocation = getParentCallerLocation();

  const templateRender = (attributes: ShapeFromDefinition<D>) => (
    <template shadowRootMode="open" data-xo-location={callerLocation}>
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

      const selectorStates: Record<
        string,
        {
          focus: boolean;
          scroll?: { left: number; top: number };
          popover: boolean;
        }
      > = {};

      const bestSelector = (element: HTMLElement, index?: number) => {
        const tag = element.tagName;
        const id = element.id;

        if (id) {
          return `${tag}#${id}`;
        }

        const key = element.getAttribute("key");

        if (key) {
          return `${tag}[key=${key}]`;
        }

        if (index) {
          return `${tag}:nth-of-type(${index})`;
        }

        return tag;
      };

      // TODO: cognitive convenience methods
      const elementStack: [element: HTMLElement, index: number][] = [];

      for (let i = 0; i < this.shadowRoot!.childNodes.length; i++) {
        elementStack.push([this.shadowRoot!.childNodes[i] as HTMLElement, i]);
      }

      const selectorStack = [];

      while (elementStack.length) {
        const [currentElement, currentIndex] = elementStack.pop()!;

        selectorStack.push(bestSelector(currentElement, currentIndex));

        if (currentElement.childNodes.length) {
          for (let i = 0; i < currentElement.childNodes.length; i++) {
            elementStack.push([currentElement.childNodes[i] as HTMLElement, i]);
          }

          continue;
        }

        let hasState = false;
        const states = {
          focus: false,
          popover: false,
          scroll: { top: 0, left: 0 },
        };

        if (document.activeElement === currentElement) {
          hasState = true;
          states.focus = true;
        }

        if (currentElement?.matches(":popover-open")) {
          hasState = true;
          states.popover = true;
        }

        if (currentElement.scrollTop || currentElement.scrollLeft) {
          hasState = true;
          states.scroll = {
            top: currentElement.scrollTop,
            left: currentElement.scrollLeft,
          };
        }

        if (hasState) {
          selectorStates[selectorStack.join(" > ")] = states;
        }

        selectorStack.pop();
      }

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

          for (const selector in selectorStates) {
            const { focus, scroll, popover } = selectorStates[selector];

            const element = document.querySelector(selector) as HTMLElement;

            if (!element) {
              console.warn(new CutoutError(CutoutErrorCode.OPERATION_FAILURE, {
                context: { name, selector, method: "querySelector" },
                guidance: // TODO: add to 'constants'
                  "Consider explicitly setting an `id` or `key` on this element to preserve its browser state between renders.",
              }).toString());
              continue;
            }

            if (focus) {
              element.focus();
            }

            if (scroll) {
              element.scrollBy(scroll);
            }

            if (popover) {
              element.showPopover();
            }
          }

          this.#isRendering = false;
        },
      );
    }
  };

  const _ = { name: `xo-${name}` };
  const result = (
    attributes: ShapeFromDefinition<D>,
    { dsd = true, registry = globalThis.customElements } = {},
  ): CutoutGeneratorToken => {
    if (!registry?.get(`xo-${name}`)) {
      registry.define(`xo-${name}`, element);
    } else {
      console.warn(
        new CutoutError(CutoutErrorCode.OPERATION_REDUNDANT, {
          context: { name: `xo-${name}` },
        }).toString(),
      );
    }

    if (!dsd) {
      return <_.name {...attributes}></_.name>;
    }

    // TODO: omit `style` if no stylesheet
    return (
      <_.name {...attributes}>
        <style>
          {/* TODO(#53): merge/manage DSD style rules */}
          {_stylesheet.map((rule) => rule?.cssText).join("\n")}
        </style>
        {templateRender(attributes)}
      </_.name>
    );
  };

  return result;
}
