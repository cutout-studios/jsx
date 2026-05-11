export class HTMLElement {}

export class CSSRule {}

(function () {
  globalThis.HTMLElement = HTMLElement;
  globalThis.CSSRule = CSSRule;

  const _registryMap = new Map();

  globalThis.customElements = {
    get(tag) {
      return _registryMap.get(tag);
    },
    define(tag, element) {
      _registryMap.set(tag, element);
    }
  }
})();
