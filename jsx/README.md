# `@cutout/jsx`

[![JSR](https://jsr.io/badges/@cutout/jsx)](https://jsr.io/@cutout/jsx)

`@cutout/jsx` is a generic, interpretable JSX runtime for the Deno ecosystem.
It's inspired in part by the long-abandoned
[OpenJSX](https://github.com/OpenJSX). _Write JSX once, use it anywhere._

In combination with the rich first-party
[Deno standard library](https://docs.deno.com/runtime/reference/std/) and
[command line tools](https://docs.deno.com/runtime/reference/cli/), this library
is intended as the "smallest missing piece" required to enable a
[full-stack workflow](#full-application) that should stand up to **React +
Next.js** for a large number of applications.

The [examples that follow](#more-examples) are implemented in such a manner and
are [competitive with React in terms of rendering performance](./BENCHMARKS.md).

## How it works

```tsx
/** @jsxImportSource jsr:@cutout/jsx */

import { dom, html } from "jsr:@cutout/jsx/format";

// -- browser platform --
/** @jsxImportSourceTypes jsr:@cutout/jsx/format/dom */

console.log(
  dom(<div></div>),
); // => HTMLCollection [<div></div>]

// -- any platform --
/** @jsxImportSourceTypes jsr:@cutout/jsx/format/html */

console.log(
  html(<div></div>),
); // => "<div></div>"
```

It looks simple enough, but what's happening here is:

1. **[`@cutout/jsx`](./jsx/module.ts)** - in a new TSX file, we're pointing our
   `@jsxImportSource` to _this_ runtime (`@cutout/jsx`) instead of the default
   one (React).
   - Optionally, the `@jsxImportSourceTypes` can be set to add per-format
     typing. _NOTE: eventually the plan is to be able to mix and match formats,
     see [Issue #31](https://github.com/cutout-studios/jsx/issues/31)_
2. The `@cutout/jsx` runtime _progressively evaluates_ your JSX via a
   [`Generator`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator),
   returning a flat stream of tuple-like values we call "tokens". You shouldn't
   often need to work with tokens directly, but they're defined in the
   **[`@cutout/jsx/tokens`](./tokens)** submodule if need be.
3. **[`@cutout/jsx/format`](./format)** - Each JSX token stream can then be
   consumed by any provided formatter, resulting in that format (and you can
   easily write your own).

Any script written in the above way can simply be
[run with Deno directly](https://docs.deno.com/runtime/reference/cli/run/), no
setup or build required:

```sh
deno myCutoutApp.tsx
```

## More Examples

> [!WARNING]
> Github doesn't properly support JSX or comment-tagged template highlighting.
> The highlighting you see here is not what will appear in your editor.

### Client-Side Rendering

The `dom` format is used to build dom elements on the fly, as you might for a
Single-Page App (SPA). Run `deno task example:spa` to try it:

```tsx
// excerpt from format/dom/example/app/element.tsx
export class ExampleElement extends BaseElement {
  static observedAttributes = ["color"];

  randomizeColor = () => {
    this.setAttribute(
      "color",
      `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    );
  };

  // `render` is called every time "color" is changed, just like React.
  render({ color = "black" }) {
    return dom(
      <>
        <style>{/* css */ `h1 { color: ${color}; }`}</style>
        <h1>Hello, World!</h1>
        <button type="button" onclick={this.randomizeColor}>
          Randomize Color
        </button>
      </>,
    );
  }
}
```

> [!NOTE]
> This `BaseElement` definition is a very minimal extension of the WebComponent
> class. You can find it at
> [format/dom/example/app/base.ts](./format/dom/example/app/base.ts).

### Server-Side Rendering (SSR)

The `html` format makes it easy to generate HTML text server-side. Run
`deno task example:ssr` for this one:

```tsx
// excerpt from format/html/example.tsx
Deno.serve(
  // [...]
  createHTMLRoute("/echo/:message/", ({ message = "No Message." }) => {
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

    return html(
      <html>
        <head>
          <title>HTML Example | {message}</title>

          <style>
            {/* css */ `h1 { color: ${randomColor}; }`}
          </style>
        </head>
        <body>
          <h1>{message}</h1>
        </body>
      </html>,
    );
  }),
  // [...]
);
```

### Full Application

While a runnable full-stack example is still in development, the Deno +
`@cutout/jsx` stack maps onto React + Next.js roughly as follows:

| Concern                | React + Next.js         | `@cutout/jsx` + Deno  |
| ---------------------- | ----------------------- | --------------------- |
| Package management     | npm + lockfile          | URL Imports           |
| Formatting             | prettier                | `deno fmt`            |
| Linting                | eslint                  | `deno lint`           |
| Testing                | Jest                    | `deno test`           |
| Build step             | Turbopack/Webpack       | **None** (direct TSX) |
| JSX rendering          | React + renderer        | `@cutout/jsx`         |
| Routing                | File-based / App Router | `@std/http`           |
| HTTP middleware        | Route handlers          | Function composition  |
| Deployment             | Vercel                  | Deno Deploy           |
| **Total Dependencies** | Several                 | **One**               |

---

[Copyright 2026, Cutout Studios](./LICENSE)
