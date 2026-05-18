/// <reference lib="dom" />

import type { Registry } from "../../../base.ts";
import type {
  ElementEntry,
  EntryDefinition,
  ShapeValueFor,
} from "../../../types.ts";
import type { Options } from "../types.ts";
import { BaseElement } from "./base.tsx";

export function registerBrowserElement<D extends EntryDefinition>(tag: string, {
  definition,
  registry = customElements as unknown as Registry, // Close enough
  render,
  connectedCallback,
  attributeChangedCallback,
  disconnectedCallback,
  stylesheet = [],
}: Options<D> = {}) {
  const systemTag = `xo-${tag}`;
  const observedAttributes = Object.keys(definition ?? []);

  registry.define(
    systemTag,
    // TODO: entry type delegation
    class extends BaseElement<D> implements ElementEntry<D> {
      static override observedAttributes = observedAttributes;

      override readonly observedAttributesMirror: string[] = observedAttributes;
      override readonly definition = definition;
      override readonly render = render;
      override readonly stylesheet = stylesheet;
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
}
