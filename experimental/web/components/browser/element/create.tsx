/** @jsxImportSourceTypes @cutout/web/projections/dom */

import { ELEMENT_TAG_PREFIX } from "../../constants.ts";
import type {
  Element,
  ElementJSX,
  OptionsFor,
  ShapeValueFor,
  Style,
  TypeDefinition,
} from "../../types.ts";
import { BaseElement } from "./base.tsx";

/** @internal */
export function createBrowserElement<
  const D extends TypeDefinition,
>(tag: string, {
  type,
  name,
  render,
  connectedCallback,
  attributeChangedCallback,
  disconnectedCallback,
  stylesheet,
}: OptionsFor<Element<D>>): ElementJSX<D> {
  const systemTag = `${ELEMENT_TAG_PREFIX}-${tag}`;
  const observedAttributes = Object.keys(type ?? []);

  customElements.define(
    systemTag,
    class extends BaseElement<D> implements Element<D> {
      static override observedAttributes = observedAttributes;

      override readonly observedAttributesMirror: string[] = observedAttributes;
      override readonly render = render;
      override readonly stylesheet = stylesheet;
      override readonly type = type;
      name = name;
      router = Reflect.construct(
        class {
          render = () => <>TODO</>;
          name = "TODO";
          static = true;
          router = this;
        },
        [],
      );
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

    return (
      <_.systemTag {...attributes}>
        <template shadowrootmode="open">
          {
            <style>
              {(Array.isArray(stylesheet) ? stylesheet : [stylesheet]).map((
                _style: Style,
              ) => _style.content).join("\n")}
            </style>
          }
          {render?.(attributes)}
        </template>
      </_.systemTag>
    );
  };
}
