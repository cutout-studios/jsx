import type { ElementConstructor, EntryDefinition } from "./types.ts";

export function isElementEntryConstructor(
  value: unknown,
): value is ElementConstructor<EntryDefinition> {
  if (typeof value !== "function") {
    return false;
  }

  return isHTMLElement(Reflect.construct(value, []));
}

export function isHTMLElement(value: unknown) {
  if (typeof value !== "object") {
    return false;
  }

  if (value === null) {
    return false;
  }

  // Not nearly exhaustive, but these are the most important
  // properties for this framework
  return [
    "attributes",
    "children",
    "classList",
    "dataset",
    "id",
    "innerHTML",
    "tagName",
  ].every((key) => Object.hasOwn(value, key));
}
