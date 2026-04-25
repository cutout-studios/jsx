# `@cutout/tauri`

## The Idea

- Embed `Deno` in a Tauri application. Have `Deno` run a `@cutout/web` server
  that the Tauri webview loads.
  - Also, expose a "Capabilties" HTTP API/channel that the `@cutout/web` server
    can use to make native calls.

## iOS de-risking TODOs

iOS forbids JIT-ful processes. De-risking the iOS path blocks this module's
development.

- [ ] **Modify OSS build scripts so Jit-less/FFI-less `deno_runtime` builds and
      runs on iOS.** Link this into a Tauri iOS binary, boot a nontrivial `Deno`
      server end-to-end.

> State of community efforts: https://github.com/denoland/rusty_v8/issues/1640.
> All other platforms are in some state accounted for.

- [ ] **Ensure `@cutout/jsx` is jitless-friendly.** Jitless V8
      [runs everything through the interpreter](https://v8.dev/blog/jitless#:~:text=Essentially%2C%20V8%20switches%20into%20an,pattern%20matching%20is%20likewise%20interpreted.),
      and some patterns — generators in particular — have poor interpreter-mode
      performance. The `@cutout/jsx` renderer
      [leans on generator-based traversal in places](../web/BENCHMARKS.md); we
      need a **flattened-generator mode** that emits non-generator equivalents
      for the jitless target.

---

[Copyright 2026, Cutout Studios](./LICENSE)
