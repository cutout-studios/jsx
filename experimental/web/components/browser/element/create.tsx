/** @jsxImportSourceTypes @cutout/web/projections/dom */

import { ELEMENT_TAG_PREFIX } from "../../constants.ts";
import type { ShapeValueFor, Type } from "../../types.ts";
import type { Element, ElementJSX, ElementOptions } from "../../types.ts";
import { BaseElement } from "./base.tsx";

/**
 * Registers a WebComponent in the given browsers' component registry,
 * returning a function that can be used to invoke that Element via JSX.
 *
 * Note that this is the browser-specific implementation of the Element factory,
 * but it's also called in {@link ../../element.ts}
 * in the serner by way of `@cutout/polyfill`.
 *
 * @param {string} tag The desired element tag for use in HTML. Must be unique.
 * @param {ElementOptions} options Options for configuring the Element generation.
 * @returns {ElementJSX} The generated Elements' JSX function.
 */
export function createBrowserElement<
  D extends Type,
>(tag: string, {
  type,
  tagPrefix = ELEMENT_TAG_PREFIX,
  render,
  route,
  connectedCallback,
  attributeChangedCallback,
  disconnectedCallback,
  stylesheet = [],
}: ElementOptions<D>): ElementJSX<D> {
  const systemTag = `${tagPrefix}-${tag}`;
  const observedAttributes = Object.keys(type ?? []);

  customElements.define(
    systemTag,
    class extends BaseElement<D> implements Element<D> {
      static override observedAttributes = observedAttributes;

      override readonly observedAttributesMirror: string[] = observedAttributes;
      override readonly type = type;
      override readonly render = render;
      override readonly stylesheet = stylesheet;
      route = route;
      tag = systemTag;

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

    // TODO(#53): merge/manage DSD style rules
    return (
      <_.systemTag {...attributes}>
        <template shadowrootmode="open">
          {stylesheet.length && (
            <style>
              {stylesheet.map((style) => style.cssText).join("\n")}
            </style>
          )}
          {render?.(attributes)}
        </template>
      </_.systemTag>
    );
  };
}
