/** @jsxImportSourceTypes @cutout/web/format/dom */

import { ELEMENT_TAG_PREFIX } from "../../constants.ts";
import type { BaseRegistry } from "../../registry/base.ts";
import type { Definition, ShapeValueFor } from "../../types.ts";
import type { Element, ElementJSX, ElementJSXOptions } from "../../types.ts";
import { BaseElement } from "./base.tsx";

export function registerBrowserElement<
  D extends Definition,
>(tag: string, {
  definition,
  tagPrefix = ELEMENT_TAG_PREFIX,
  registry = customElements as unknown as BaseRegistry, // Close enough
  render,
  route,
  connectedCallback,
  attributeChangedCallback,
  disconnectedCallback,
  stylesheet = [],
}: ElementJSXOptions<D>): ElementJSX<D> {
  const systemTag = `${tagPrefix}-${tag}`;
  const observedAttributes = Object.keys(definition ?? []);

  registry.define(
    systemTag,
    class extends BaseElement<D> implements Element<D> {
      static override observedAttributes = observedAttributes;

      override readonly observedAttributesMirror: string[] = observedAttributes;
      override readonly definition = definition;
      override readonly render = render;
      override readonly stylesheet = stylesheet;
      route = route;
      name = systemTag;

      override connectedCallback() {
        connectedCallback?.();
        super.connectedCallback();
      }

      override attributeChangedCallback<K extends keyof D>(
        name: K,
        newValue: ShapeValueFor<D[K]>,
        oldValue: ShapeValueFor<D[K]>,
      ) {
        attributeChangedCallback?.(name, newValue, oldValue);
        super.attributeChangedCallback(name, newValue, oldValue);
      }

      override disconnectedCallback() {
        disconnectedCallback?.();
        super.disconnectedCallback();
      }
    },
  );

  const _ = { systemTag };
  return (attributes, options) => {
    if (options?.shallow) {
      return <_.systemTag {...attributes}></_.systemTag>;
    }

    if (!stylesheet.length) {
      return <_.systemTag {...attributes}>{render?.(attributes)}</_.systemTag>;
    }

    // TODO(#53): merge/manage DSD style rules
    return (
      <_.systemTag {...attributes}>
        <style>
          {stylesheet.map((style) => style.cssText).join("\n")}
        </style>
        {render?.(attributes)}
      </_.systemTag>
    );
  };
}
