# `@cutout/tauri`

**The Idea**: Embed `Deno` in a
[cross-platform Tauri application](https://v2.tauri.app/distribute/). Have
`Deno` run a server that the Tauri webview loads.

> [!CAUTION]
> We're currently researching the viability of this approach. It seems promising
> thusfar, but could be deemed inviable at any point.

## De-risking iOS cross-compilation

While all other major platforms seem to be accounted for, iOS forbids JIT-ful
processes like V8, making it the biggest hurdle for this approach.

So far we've been able to create
[a repeatable iOS simulator build](https://github.com/cutout-studios/toolbox/blob/main/experimental/tauri/scripts/buildApple/main.sh)
for `deno_core`. The next steps are to:

- [ ] Link this `rlib` into a Tauri app and exercise it in the iOS Simulator.
- [ ] Review the available extensions in
      [`deno/ext`](https://github.com/denoland/deno/tree/main/ext) and
      prioritize their support. We believe if `deno_core` can be successfully
      exercised in a Tauri app, a majority of these extensions can eventually
      have iOS support with Tauri's help (with some key execeptions).

## Core Security Considerations

- The local server is a blatant attack surface: bind to `[::1]` with an
  ephemeral port.
- Lock down the host and origin on every request. Use a per-session header-based
  token.
- Strictly configure CORS and CSP.

---

<p align="center">
  <a href="https://github.com/cutout-studios/.github/main/profile/TRADEMARK.md">Copyright 2026, Cutout Studios</a>
</p>
