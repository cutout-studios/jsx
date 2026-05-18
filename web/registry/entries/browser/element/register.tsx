/** @jsxImportSourceTypes @cutout/web/format/dom */

import type { BaseRegistry } from "../../../base.ts";
import type {
  ElementEntry,
  ElementJSXFunction,
  EntryDefinition,
  ShapeFor,
  ShapeValueFor,
} from "../../../types.ts";
import type { ElementEntryOptions } from "../../../types.ts";
import { BaseElement } from "./base.tsx";

export function registerBrowserElement<D extends EntryDefinition>(tag: string, {
  definition,
  registry = customElements as unknown as BaseRegistry, // Close enough
  render,
  route,
  connectedCallback,
  attributeChangedCallback,
  disconnectedCallback,
  stylesheet = [],
}: ElementEntryOptions<D> = {}): ElementJSXFunction<D> {
  const systemTag = `xo-${tag}`;
  const observedAttributes = Object.keys(definition ?? []);

  registry.define(
    systemTag,
    class extends BaseElement<D> implements ElementEntry<D> {
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
  return (attributes?: ShapeFor<D>, options?) => {
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
