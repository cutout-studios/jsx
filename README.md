# `@cutout/jsx`

A generic JSX pragma for runtime interpretation.

```tsx
/* @jsx jsr:@cutout/jsx */

import { html, style } from "@cutout/jsx/html";

Deno.serve((request) => {
  // very naive routing
  if (request.url.endsWith("/hello")) {
    const helloMessage = "hello!";

    return new Response(
      html(
        <html>
          <head>
            <title>{helloMessage}</title>
            {style`h1 { color: red; }`}
          </head>
          <body>
            <h1>{helloMessage}</h1>
          </body>
        </html>,
      ),
    );
  }

  return new Response(
    html(<h1>Not Found</h1>),
    { status: 404 },
  );
});
```

```tsx
/* @jsx jsr:@cutout/jsx */

import { dom } from "@cutout/jsx/element";

class MyButton extends HTMLElement {
  // ... 
}
```

## Contributing

**Interested in contributing?** See our [Contribution Guide](./CONTRIBUTING.md).
