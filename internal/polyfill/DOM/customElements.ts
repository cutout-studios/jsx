import { _globalThis } from "../global.ts";
import type { HTMLElement } from "./HTMLElement.ts";

type _CustomElementConstructor = {
  prototype: HTMLElement;
  new (...args: unknown[]): HTMLElement;
}

interface _CustomElementRegistry {
  get(tag: string): _CustomElementConstructor | undefined;
  define(tag: string, element: _CustomElementConstructor): void;
}

const _internalRegistryMap = new Map<string, _CustomElementConstructor>();

const customElements: _CustomElementRegistry = {
  get(tag) {
    return _internalRegistryMap.get(tag);
  },
  define(tag, element) {
    _internalRegistryMap.set(tag, element);
  },
};

_globalThis.customElements = customElements;
