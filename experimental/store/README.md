# `@cutout/store`

**The Idea**: Store and retrieve the JSX IR across various backends. Something
like this:

```tsx
import { CutoutMemoryStore } from "@cutout/store";
import { entries } from "@cutout/store/projections";

const store = new CutoutMemoryStore();

const dataEntries = entries(
  <>
    {/* Use whatever markup you want, even HTML. */}
    <user id={123}>
      <username>bobadams</username>
      <displayname>Bob Adams</displayname>
    </user>

    <user id={456}>
      <username>denathor345</username>
      <displayname>Denathor Roxx</displayname>
    </user>
  </>,
);

// The "Store" interface intentionally mirrors JS' "Map".
for (const [keyPath, values] of dataEntries) {
  store.set(keyPath, values);
}

// Later...
import { rawText } from "@cutout/jsx/projections";
import { query } from "@cutout/store/projections";

const dataQuery = query(
  <user id={123}></user>,
);

console.log(
  // => raw text of the stored IR subtree
  rawText(store.get(dataQuery)),
);
```

> [!NOTE]
> The store in the above example does not handle the subtree nesting; the
> `entries` projection instead generates all key-value permutations.

---

[Copyright 2026, Cutout Studios](https://github.com/cutout-studios/toolbox/blob/main/LICENSE)
