export class HTMLElement {}

export class CSSRule {
  constructor(cssText) {
    this.cssText = cssText;
  }
}

(function () {
  globalThis.HTMLElement = HTMLElement;
  globalThis.CSSRule = CSSRule;
})();
