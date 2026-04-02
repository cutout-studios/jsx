# `@cutout/jsx`

A generic JSX pragma for runtime interpretation.

```tsx
/* @jsx jsr:@cutout/jsx */

import { server } from "@cutout/jsx/server";
import { style } from "@cutout/jsx/html";

// NOTE: this API is too opinionated atm
server.addRoute("/hello", () => (
  <html>
    <head>
      <title>{"hello!"}</title>
      {style`h1 { color: red; }`}
    </head>
    <body>
      <h1>{"hello!"}</h1>
    </body>
  </html>
));

server.start({ port: 3000 });
```

## Contributing

**Interested in contributing?** See our [Contribution Guide](./CONTRIBUTING.md).
