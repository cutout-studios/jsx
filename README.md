# ✂️ `@cutout/jsx`

[![JSR](https://jsr.io/badges/@cutout/jsx)](https://jsr.io/@cutout/jsx)
[![Maintainability](https://qlty.sh/badges/63ab5737-a9d3-4598-855e-83c7fe779ec6/maintainability.svg)](https://qlty.sh/gh/cutout-studios/projects/jsx)
[![Code Coverage](https://qlty.sh/badges/63ab5737-a9d3-4598-855e-83c7fe779ec6/coverage.svg)](https://qlty.sh/gh/cutout-studios/projects/jsx)

> [!CAUTION]
> `@cutout/jsx` is deeply in alpha and is intended only for discussion, not
> production use.

`@cutout/jsx` is a generic, interpretable JSX runtime, inspired in part by the
long-abandoned [OpenJSX](https://github.com/OpenJSX).

## Examples

### Single-Page App (SPA)

Run `deno task example:spa` to test the following locally:

```tsx
// excerpt from format/elements/example/app/element.tsx
export class ExampleElement extends BaseElement {
  static observedAttributes = ["color"];

  randomizeColor = () => {
    this.setAttribute(
      "color",
      `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    );
  };

  render({ color = "black" }) {
    return (
      <>
        <style>{/* css */ `h1 { color: ${color}; }`}</style>
        <h1>Hello, World!</h1>
        <button type="button" onclick={this.randomizeColor}>
          Randomize Color
        </button>
      </>
    );
  }
}
```

### Server-Side Rendering (SSR)

Run `deno task example:ssr` to test the following locally:

```tsx
// excerpt from format/html/example.tsx
Deno.serve(
  // [...]
  (_request: Request, params) => {
    const message = decodeURIComponent(
      params?.pathname.groups.message ?? "",
    );
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

    return new Response(
      html(
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
      ),
      {
        status: 200,
        headers: {
          "content-type": "text/html",
        },
      },
    );
  },
  // [...]
);
```

## Benchmarks

_TODO([#22](https://github.com/cutout-studios/jsx/issues/22)): Add react
benchmark for comparsion_

```
    CPU | Apple M5 Max
Runtime | Deno 2.7.5 (aarch64-apple-darwin)

| benchmark                        | time/iter (avg) |        iter/s |      (min … max)      |      p75 |      p99 |     p995 |
| -------------------------------- | --------------- | ------------- | --------------------- | -------- | -------- | -------- |

group wikipedia.org (no style/script tags)
| format/element - wikipedia.org   |          3.4 ms |         289.9 | (  2.8 ms …   7.2 ms) |   3.8 ms |   7.1 ms |   7.2 ms |
| format/html - wikipedia.org      |          2.4 ms |         409.3 | (  2.0 ms …   3.9 ms) |   2.5 ms |   3.8 ms |   3.8 ms |

summary
  format/html - wikipedia.org
     1.41x faster than format/element - wikipedia.org

group 10000 rows
| format/element - 10000 rows      |         21.4 ms |          46.6 | ( 19.0 ms …  37.1 ms) |  21.8 ms |  37.1 ms |  37.1 ms |
| format/html - 10000 rows         |         15.3 ms |          65.5 | ( 12.4 ms …  20.0 ms) |  16.3 ms |  20.0 ms |  20.0 ms |

summary
  format/html - 10000 rows
     1.40x faster than format/element - 10000 rows
```

## Contributing

**Interested in contributing?** See our [Contribution Guide](./CONTRIBUTING.md).
