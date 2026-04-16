# ✂️ `@cutout/jsx`

[![JSR](https://jsr.io/badges/@cutout/jsx)](https://jsr.io/@cutout/jsx)
[![Maintainability](https://qlty.sh/badges/63ab5737-a9d3-4598-855e-83c7fe779ec6/maintainability.svg)](https://qlty.sh/gh/cutout-studios/projects/jsx)
[![Code Coverage](https://qlty.sh/badges/63ab5737-a9d3-4598-855e-83c7fe779ec6/coverage.svg)](https://qlty.sh/gh/cutout-studios/projects/jsx)

`@cutout/jsx` is a generic, interpretable JSX runtime, inspired in part by the
long-abandoned [OpenJSX](https://github.com/OpenJSX). _Write JSX once, use it
anywhere._

**This library is intended to replace React and Next.js**, enabling a full-stack
workflow for the [Deno runtime](https://deno.com/) that requires **no additional
dependencies** outside of the
[Deno standard library](https://docs.deno.com/runtime/reference/std/) and
[command line tools](https://docs.deno.com/runtime/reference/cli/). The
[examples that follow](#more-examples) are implemented as such, and are
[sufficiently performant](#benchmarks).

> [!CAUTION]
> `@cutout/jsx` is deeply in alpha and is currently for discussion only: not
> production use.

## How it works

```tsx
/** @jsxImportSource jsr:@cutout/jsx */

import { elements, html } from "jsr:@cutout/jsx/format";

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
1. The `@cutout/jsx` runtime _progressively evaluates_ your JSX via a
   [`Generator`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator),
   returning a flat stream of tuple-like values we call "tokens". You shouldn't
   often need to work with tokens directly, but they're defined in the
   [`@cutout/jsx/tokens`](./tokens) submodule if need be.
1. **[`@cutout/jsx/format`](./format)** - Each JSX token stream can then be
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

_Pending development._

## Benchmarks

_TODO([#22](https://github.com/cutout-studios/jsx/issues/22)): Add react
benchmark for comparsion_

```
    CPU | Apple M5 Max
Runtime | Deno 2.7.5 (aarch64-apple-darwin)

| benchmark                                  | time/iter (avg) |        iter/s |      (min … max)      |      p75 |      p99 |     p995 |
| ------------------------------------------ | --------------- | ------------- | --------------------- | -------- | -------- | -------- |

group wikipedia.org (no style/script tags)
| format/dom via happy-dom - wikipedia.org   |         10.6 ms |          94.4 | (  8.4 ms …  18.6 ms) |  10.9 ms |  18.6 ms |  18.6 ms |
| format/html - wikipedia.org                |          2.4 ms |         423.1 | (  2.1 ms …   4.2 ms) |   2.3 ms |   3.7 ms |   3.7 ms |

summary
  format/html - wikipedia.org
     4.48x faster than format/dom via happy-dom - wikipedia.org

group 10000 rows
| format/dom via happy-dom - 10000 rows      |         64.0 ms |          15.6 | ( 59.7 ms …  83.5 ms) |  64.5 ms |  83.5 ms |  83.5 ms |
| format/html - 10000 rows                   |         11.9 ms |          83.8 | ( 10.9 ms …  18.4 ms) |  12.4 ms |  18.4 ms |  18.4 ms |

summary
  format/html - 10000 rows
     5.36x faster than format/dom via happy-dom - 10000 rows
```

## Contributing

**Interested in contributing?** See our [Contribution Guide](./CONTRIBUTING.md).

---

[Copyright 2026, Cutout Studios](./LICENSE)
