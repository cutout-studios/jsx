# `@cutout/jsx`

[![JSR](https://jsr.io/badges/@cutout/jsx)](https://jsr.io/@cutout/jsx)

`@cutout/jsx` is a generic, interpretable JSX runtime for the Deno ecosystem.
It's inspired in part by the long-abandoned
[OpenJSX](https://github.com/OpenJSX). _Write JSX once, use it anywhere._

## How it works

```tsx
/** @jsxImportSource jsr:@cutout/jsx */

import { dom, html } from "./myFormat.ts";

// -- browser platform --
/** @jsxImportSourceTypes jsr:@cutout/web/format/dom */

console.log(
  dom(<div></div>),
); // => HTMLCollection [<div></div>]

// -- any platform --
/** @jsxImportSourceTypes jsr:@cutout/web/format/html */

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
3. Each JSX token stream can then be consumed by any provided formatter (such as
   the ones implemented in `@cutout/web`), resulting in that format (and you can
   easily write your own).

Any script written in the above way can simply be
[run with Deno directly](https://docs.deno.com/runtime/reference/cli/run/), no
setup or build required:

```sh
deno myCutoutApp.tsx
```

---

[Copyright 2026, Cutout Studios](../LICENSE)
