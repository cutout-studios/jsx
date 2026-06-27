# `@cutout/store`

**The Idea**: Store and retrieve JSX across various backends. Something like
this:

```tsx
import { CutoutDocumentStore } from "@cutout/store";
import { MemoryBackend } from "@cutout/store/backends";

const store = CutoutDocumentStore.with(
  new MemoryBackend(),
);

store.upsert(
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

// Later...
import { rawText } from "@cutout/jsx/projections";

const getUser = (userId) => <user id={userId}></user>;

console.log(
  rawText( // => "<username>bobadams</username><displayname>Bob Adams</displayname>"
    store.query(getUser(123)), // get the stored IR subtree
  ),
);
```

---

[Copyright 2026, Cutout Studios](https://github.com/cutout-studios/toolbox/blob/main/LICENSE)
