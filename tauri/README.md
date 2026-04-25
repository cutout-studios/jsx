# `@cutout/tauri`

## The Idea

- Embed `Deno` in a Tauri application. Have `Deno` run a `@cutout/web` server
  that the Tauri webview loads.
  - Also, expose a "Capabilties" HTTP API, that the `@cutout/web` server can use
    to make native calls.

## iOS de-risking TODOs

iOS forbids JIT-ful processes. De-risking the iOS path blocks this module's
development.

- [ ] **Ensure Jitless `deno_core` builds and runs on iOS.** Compile `rusty_v8`
      (and by extension `deno_core`) with the jitless configuration, link into a
      Tauri iOS binary, boot a nontrivial `@cutout/web` server end-to-end.
      - State of community efforts: https://github.com/denoland/rusty_v8/issues/1640
- [ ] **Ensure JSX renderer is jitless-friendly.** Jitless V8 interprets
      everything through Ignition, and some patterns — generators in particular
      — have notably poor interpreter-mode performance. The `@cutout/jsx`
      renderer
      [leans on generator-based traversal in places](../jsx/BENCHMARKS.md); we
      need a **flattened-generator mode** that emits non-generator equivalents
      for the jitless target.

---

[Copyright 2026, Cutout Studios](./LICENSE)
