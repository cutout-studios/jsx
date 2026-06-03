/** @jsxImportSourceTypes @cutout/web/format/dom */

import type { CutoutGeneratorToken } from "@cutout/jsx/tokens";
import { CutoutError, CutoutErrorCode } from "@cutout/web/errors";
import { dom } from "@cutout/web/formats";

import { DOCUMENT_QUERY_SPECIFICITY_GUIDANCE } from "../../constants.ts";
import { parseRawValue } from "../../parse.ts";
import type {
  Type,
  ShapeFor,
  ShapeValueFor,
  Style,
  ValidDefinitionConstructor,
} from "../../types.ts";

export class BaseElement<D extends Type> extends HTMLElement {
  static readonly observedAttributes: string[];

  readonly observedAttributesMirror: string[] = BaseElement.observedAttributes;
  readonly type?: D;
  readonly stylesheet?: Style[] = [];
  readonly render?: (attributes: ShapeFor<D>) => CutoutGeneratorToken = () => (
    <slot></slot>
  );

  get stylesheets() {
    const stylesheet = new CSSStyleSheet();

    for (const rule of this?.stylesheet ?? []) {
      stylesheet.insertRule(rule.cssText);
    }

    return [stylesheet];
  }

  get observedAttributes() {
    return this.observedAttributesMirror.reduce((result, attributeName) => ({
      ...result,
      [attributeName]: parseRawValue(
        this.getAttribute(attributeName)!,
        this.definition![attributeName] as ValidDefinitionConstructor,
      ),
    }), {});
  }

  connectedCallback() {
    this.#doRender();
  }

  attributeChangedCallback<K extends keyof D>(
    _name: K,
    _newValue: ShapeValueFor<D[K]>,
    _oldValue: ShapeValueFor<D[K]>,
  ) {
    if (this.#pendingAttributeChange) {
      cancelAnimationFrame(this.#pendingAttributeChange);
    }

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

  disconnectedCallback() {
    this.#eventController.abort();
  }

  #pendingAttributeChange?: number;
  #eventController = new AbortController();
  #isRendering = false;

  get #render() {
    return Array.from(
      dom(
        <template shadowrootmode="open">
          {this.render?.(this.observedAttributes)}
        </template>,
        {
          event: { signal: this.#eventController.signal },
        },
      ),
    );
  }

  #doRender() {
    if (this.#isRendering) return;
    this.#isRendering = true;

    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
    }

    const root = this.shadowRoot!;

    root.adoptedStyleSheets = this.stylesheets;

    const selectorStates = _getDOMSelectorStates(root);
    requestAnimationFrame(
      () => {
        root.replaceChildren(...this.#render);
        root.appendChild(root.cloneNode(true));

        _applyDOMSelectorStates(root, selectorStates);
        this.#isRendering = false;
      },
    );
  }
}

// Cognitive convenience methods
type DOMSelectorStates = Record<
  string,
  {
    focus: boolean;
    scroll?: { left: number; top: number };
    popover: boolean;
  }
>;

function _getDOMSelectorStates(root: ShadowRoot): DOMSelectorStates {
  const selectorStates: DOMSelectorStates = {};
  const elementStack: [element: HTMLElement, index: number][] = [];

  for (let i = 0; i < root.childNodes.length; i++) {
    elementStack.push([root.childNodes[i] as HTMLElement, i]);
  }

  const selectorStack = [];
  while (elementStack.length) {
    const [currentElement, currentIndex] = elementStack.pop()!;

    selectorStack.push(_getBestSelector(currentElement, currentIndex));

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

  return selectorStates;
}

function _applyDOMSelectorStates(
  root: ShadowRoot,
  selectorStates: DOMSelectorStates,
) {
  for (const selector in selectorStates) {
    const { focus, scroll, popover } = selectorStates[selector];

    const element = root.querySelector(selector) as HTMLElement;

    if (!element) {
      console.warn(new CutoutError(CutoutErrorCode.OPERATION_FAILURE, {
        context: { selector, method: "querySelector" },
        guidance: DOCUMENT_QUERY_SPECIFICITY_GUIDANCE,
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
}

function _getBestSelector(element: HTMLElement, index?: number) {
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
}
