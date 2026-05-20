export type {
  Definition as CutoutDefinition,
  Element as CutoutElement,
  ElementJSX as CutoutElementJSX,
  ElementOptions as CutoutElementJSXOptions,
  ElementRenderFunction as CutoutElementRenderFunction,
  Route as CutoutRoute,
  RouteOptions as CutoutRouteOptions,
  RouteRenderFunction as CutoutRouteRenderFunction,
  Style as CutoutStyle,
  StyleOptions as CutoutStyleOptions,
} from "./types.ts";

export { registerRoute } from "./route.ts";
export { registerStyle } from "./style.ts";
export { registerElement } from "./element.ts";

export type {
  ComponentProxyConstructor as CutoutConstructor,
  ElementConstructor as CutoutElementConstructor,
  Registry as CutoutRegistryInterface,
  RouteProxyConstructor as CutoutRouteConstructor,
  StyleProxyConstructor as CutoutStyleConstructor,
} from "./registry/types.ts";

export { BaseRegistry as CutoutRegistry } from "./registry/base.ts";
