# `@cutout/agent`

**The Idea**: Store and retrieve the JSX IR across various backends:

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

for (const [key, value] of dataEntries) {
  store.set(key, value);
}
```

---

[Copyright 2026, Cutout Studios](https://github.com/cutout-studios/toolbox/blob/main/LICENSE)
