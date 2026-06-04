import { createBrowserElement } from "./browser/element/create.tsx";
import type {
  Type,
  ElementJSX,
  ElementOptions as ElementOptions,
} from "./types.ts";

export function createElement<D extends Type>(
  tag: string,
  {
    ...options
  }: ElementOptions<D>,
): ElementJSX<D> {
  return createBrowserElement(tag, { ...options });
}
