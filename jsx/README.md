# `@cutout/jsx`

[![JSR](https://jsr.io/badges/@cutout/jsx)](https://jsr.io/@cutout/jsx)
[![bundlejs](https://deno.bundlejs.com/badge?q=jsr:@cutout/jsx)](https://deno.bundlejs.com/badge?q=jsr:@cutout/jsx)

`@cutout/jsx` is a tiny, generic, interpretable JSX runtime for the Deno
ecosystem. It's inspired in part by the long-abandoned
[OpenJSX](https://github.com/OpenJSX). **_Write JSX once, use it anywhere._**

Our generator-based approach is proving suprisingly competitive, going
[toe-to-toe with React on our latest benchmarks](../web/BENCHMARKS.md).

> [!WARNING]
> `@cutout/jsx` is pending in-production testing. Use at your own discretion.

## How it works

In a new TSX file, point your `@jsxImportSource` to _this_ runtime
([`@cutout/jsx`](./module.ts)) instead of the default one (React).

```tsx
/** @jsxImportSource jsr:@cutout/jsx */
```

> [!NOTE]
> Optionally, the `@jsxImportSourceTypes` can be set to narrow your per-file
> typing:
>
> ```tsx
> /** @jsxImportSource jsr:@cutout/jsx */
> /** @jsxImportSourceTypes jsr:@cutout/web/format/dom */
> ```

The `@cutout/jsx` runtime _progressively evaluates_ your JSX via a series of
nested
[`Generators`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator):
returning a flat stream of tuple-like values we call "tokens". This token stream
can then be easily formatted however you like:

```tsx
/** @jsxImportSource jsr:@cutout/jsx */
/** @jsxImportSourceTypes jsr:@cutout/web/format/dom */

import { dom } from "@cutout/web/format/dom";

console.log(
  dom(<div></div>),
); // => HTMLCollection [<div></div>]
```

> [!WARNING]
> [`@cutout/web`](../web/) is not yet published, and is referenced here only for
> demonstration purposes.

For server-side rendering, you'd simply choose a different format:

```tsx
/** @jsxImportSource jsr:@cutout/jsx */
/** @jsxImportSourceTypes jsr:@cutout/web/format/html */

import { html } from "@cutout/web/format/html";

console.log(
  html(<div></div>),
); // => "<div></div>"
```

Any script written in the above ways can simply be
[run with Deno directly](https://docs.deno.com/runtime/reference/cli/run/), no
setup or build required:

```sh
deno myCutoutApp.tsx
```

### Custom Elements

Defining custom elements is as easy as providing a function that takes an
attributes object and returns JSX:

```tsx
const MyElement = defineElement<{ hello: string }>(
  ({ hello }) => <div>{hello}</div>,
);

const correct = <MyElement hello="123" />; // Works!
const incorrect = <MyElement hello={123} />; // Type Error.
```

## What's next

If you're interested in seeing how to most effectively leverage the
`@cutout/jsx` rendering approach, consider reviewing the proposed
[`@cutout/web`](../web/).

---

[Copyright 2026, Cutout Studios](../LICENSE)
