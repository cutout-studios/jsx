import { createBrowserElement } from "./browser/element/create.tsx";
import type {
  Element,
  ElementJSX,
  OptionsFor,
  TypeDefinition,
} from "./types.ts";

/** @internal */
export function createElement<D extends TypeDefinition>(
  tag: string,
  {
    ...options
  }: OptionsFor<Element<D>>,
): ElementJSX<D> {
  return createBrowserElement(tag, { ...options });
}
