import type { AnyShape } from "@cutout/internal";

export class HTMLElement {}
export class CSSRule {}

type CustomElementConstructor = new (...args: unknown[]) => HTMLElement;

interface MinimalCustomElementRegistry {
  get(tag: string): CustomElementConstructor | undefined;
  define(tag: string, element: CustomElementConstructor): void;
}

const registryMap = new Map<string, CustomElementConstructor>();

const customElementsShim: MinimalCustomElementRegistry = {
  get(tag) {
    return registryMap.get(tag);
  },
  define(tag, element) {
    registryMap.set(tag, element);
  },
};

// Module-local cast. globalThis's *type* is unchanged for other modules;
// we just need to satisfy TS for these specific assignments here.
const g = globalThis as unknown as AnyShape;
g.HTMLElement = HTMLElement;
g.CSSRule = CSSRule;
g.customElements = customElementsShim;
