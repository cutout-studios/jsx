# `@cutout/agent`

**The Idea**: Store and retrieve the JSX IR across various backends. Something
like this:

```tsx
import { CutoutMemoryStore } from "@cutout/store";
import { entries } from "@cutout/jsx/projections";

const store = new CutoutMemoryStore();

const dataEntries = entries(
  <ul id="users">
    <li key={123}>
      <span name="username">bobadams</span>
      <span name="displayname">Bob Adams</span>
    </li>

    <li key={456}>
      <span name="username">denathor345</span>
      <span name="displayname">Denathor Roxx</span>
    </li>
  </ul>,
);

for (const [keyPath, values] of dataEntries) {
  store.set(keyPath, values);
}

// Later...

import { path } from "@cutout/jsx/projections";

const dataQuery = path(
  <div id="users">
    <span key={123}></span>
  </div>,
);

console.log(
  store.get(dataQuery),
  // => Generator that returns...
  // PropertyToken<"username">,
  // StringToken<"bobadams">,
  // PropertyToken<"displayname">,
  // StringToken<"Bob Adams">
);
```

## Open Design Decisions

- Should set/get be async? Or there's a later "async" store?
  - That implies the existence of an async token?
- Should the store be initialized with a projection, so it also _takes_
  generators? Or is this more practical?

---

[Copyright 2026, Cutout Studios](https://github.com/cutout-studios/toolbox/blob/main/LICENSE)
