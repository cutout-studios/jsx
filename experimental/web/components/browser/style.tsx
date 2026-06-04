import type { OptionsFor, Style } from "../types.ts";

/** @internal */
export function createBrowserStyle(
  _cssText: string,
  { name, content }: OptionsFor<Style>,
): Style {
  const result = class extends CSSStyleRule implements Style {
    name = name;
    content = content;
    router = Reflect.construct(
      class {
        render = () => <>TODO</>;
        name = "TODO";
        static = true;
        router = this;
      },
      [],
    );
    constructor() {
      super();
      this.cssText = content;
    }
  };

  return Reflect.construct(result, []);
}
