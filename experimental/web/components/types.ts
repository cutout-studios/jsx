import type {
  AnyArray,
  AnyFunction,
  AnyShape,
  EmptyShape,
} from "@cutout/internal";
import type { CutoutGeneratorToken } from "@cutout/jsx/tokens";
import type { Route as _Route } from "@std/http/route";

/**
 * Used to define a `@cutout/web` component's attributes or parameters.
 *
 * TODO(#51): support nested definitions
 *
 * @example
 * ```ts
 * const definition: EntryDefinition = { name: String };
 *
 * validateData(definition, { name: "John" }); // Valid
 * validateData(definition, { name: 3 }); // Invalid
 * ```
 */
export type Type = Readonly<
  Record<PropertyKey, ValidDefinitionConstructor>
>;

/**
 * A single 'route' for matching an incoming server request to its respective component.
 * Uses:
 *   - URLPattern to match the provided `path`. The path extension determines the response content type.
 *   - The provided `definition` to parse the extracted parameters.
 *   - The provided `render` function to craft the server response body.
 */
export interface Endpoint<D extends Type> extends StandardRoute {
  /** The URLPattern string that this route matches. */
  readonly path: string;

  /** The specific route schema definition for its parameters. */
  readonly type?: D;

  /** See {@link EndpointRenderFunction} */
  readonly render?: EndpointRenderFunction<D>;
}

/**
 * Handles the final stage of route resolution.
 * Receives parsed and validated parameters along with the raw request, to produce either JSX or raw string for the response body.
 */
export type EndpointRenderFunction<D extends Type> = (
  parameters: ShapeFor<D>,
  request?: Request,
) => Promise<GeneratorToken | string>;

/**
 * Options for generating a `Route` by way of the `registerRoute` factory function.
 */
export type EndpointOptions<D extends Type> =
  & FactoryBaseOptions
  & FactoryRenderableOptions<D, EndpointRenderFunction<D>>;

/**
 * A specific, isolated CSSRule, based on the provided `text`.
 * On the server-side, a route is registered for accessing this css text from the browser.
 * This pattern allows us to merge and manage CSS atomically.
 *
 * TODO(#53): merge/manage DSD style rules
 *
 * @example
 * ```ts
 * const redText = new Style(`:host { color: red; }`); // Valid
 * const multipleRules = new Style(`p { color: red; } span { color: blue; }`); // Invalid
 * ```
 */
export interface Style extends CSSRule {
  /** The CSS text of the rule. */
  readonly text: string;

  /** On the server, the route component that resolves to this rule. */
  readonly route?: Endpoint<EmptyShape>;
}

/**
 * Options for generating a `Style` by way of the `registerStyle` factory function.
 */
export type StyleOptions =
  & FactoryBaseOptions
  & FactoryFileBasedRoutingOptions;

/**
 * Custom web component that bridges attribute validation, styling, and rendering.
 * Parses incoming attributes against the `definition`, applies registered `stylesheet` rules, and delegates
DOM updates to the `render` function.
 */
export interface Element<D extends Type> extends HTMLElement {
  /** The Element tagName (e.g. the "div" in <div></div>) */
  readonly tag: string;

  /** The specific Element schema definition for its attributes. */
  readonly type?: D;

  /** The array of style rules to apply to this Element. */
  readonly stylesheet?: Style[];

  /** See {@link ElementRenderFunction} */
  readonly render?: ElementRenderFunction<D>;

  /** On the server, the route component that resolves to this element. */
  readonly route?: Endpoint<EmptyShape>;
}

/**
 * Generates the DOM update payload for an element.
 * Runs when attributes change or during initial mount, converting validated attribute shapes into a JSX
generator token for patching or hydration.
 */
export type ElementRenderFunction<D extends Type> = (
  attributes: ShapeFor<D>,
) => GeneratorToken;

/**
 * Options for registering an `Element` function by way of the `registerElement` factory function.
 */
export type ElementOptions<D extends Type> =
  & FactoryBaseOptions
  & FactoryFileBasedRoutingOptions
  & FactoryRenderableOptions<D, ElementRenderFunction<D>>
  & {
    tagPrefix?: string;
    stylesheet?: Style[];
    connectedCallback?: () => void;
    attributeChangedCallback?: <K extends keyof D>(
      name: K,
      newValue: ShapeValueFor<D[K]>,
      oldValue: ShapeValueFor<D[K]>,
    ) => void;
    disconnectedCallback?: () => void;
  };

/**
 * Separate from the `Element` class, the `ElementJSX` is a function representation
 * of a given class, usable in JSX form.
 *
 * @example
 * ```tsx
 * // registers the class as a side-effect, but returns a useable JSX function
 * const MyElement = registerElement("element", { definition: { count: Number } });
 *
 * (
 *   <MyElement count={5}></MyElement>
 * );
 * ```
 */
export type ElementJSX<D extends Type> = (
  attributes: ShapeFor<D>,
  options?: {
    shallow: boolean;
  },
) => GeneratorToken;

/** @internal */
type FactoryBaseOptions = {};

/** @internal */
type FactoryFileBasedRoutingOptions = {
  readonly root?: string;
  readonly route?: Endpoint<EmptyShape>;
};

/** @internal */
type FactoryRenderableOptions<
  D extends Type,
  R extends AnyFunction,
> = {
  readonly type?: D;
  readonly render?: R;
};

/** @internal */
export type ValidDefinitionConstructor =
  | typeof Number
  | typeof String
  | typeof Boolean
  | typeof Symbol
  | typeof Function
  | typeof Array
  | typeof Object;

/** @internal */
export type ShapeValueFor<C extends ValidDefinitionConstructor> = C extends
  typeof Number ? number
  : C extends typeof BigInt ? bigint
  : C extends typeof String ? string
  : C extends typeof Boolean ? boolean
  : C extends typeof Symbol ? symbol
  : C extends typeof Function ? AnyFunction
  : C extends typeof Array ? AnyArray
  : C extends typeof Object ? AnyShape
  : never;

/** @internal */
export type ShapeFor<T extends Type> = {
  [K in keyof T]?: ShapeValueFor<T[K]>;
};

// These are published! We do not need to re-export them in the module!
/** @internal */
type StandardRoute = _Route;

/** @internal */
type GeneratorToken = CutoutGeneratorToken;
