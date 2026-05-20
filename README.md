# ✂️ The Cutout Toolbox 🧰

[![Maintainability](https://qlty.sh/badges/63ab5737-a9d3-4598-855e-83c7fe779ec6/maintainability.svg)](https://qlty.sh/gh/cutout-studios/projects/jsx)
[![Code Coverage](https://qlty.sh/badges/63ab5737-a9d3-4598-855e-83c7fe779ec6/coverage.svg)](https://qlty.sh/gh/cutout-studios/projects/jsx)

A collection of Deno-first tools for building cross-platform webapps. JSX, web
components, UI primitives, and a native shell: all designed to stay as close as
possible to their respective targets.

> [!CAUTION]
> These tools are either currently speculative and/or untested: not yet for
> production use.

## Contents

| Module                        | Description                                                      | Status                                                                  | Notes                                                                               |
| ----------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| [`@cutout/jsx`](./jsx/)       | **_Write JSX once, use it anywhere._** Cutout's rendering layer. | [![JSR](https://jsr.io/badges/@cutout/jsx)](https://jsr.io/@cutout/jsx) |                                                                                     |
| [`@cutout/web`](./web/)       | Core library for authoring full-stack webapps.                   | _Partially Implemented_                                                 | **3 of 4** submodules drafted.                                                      |
| [`@cutout/tauri`](./tauri/)   | Embed your `@cutout/web` app in a cross-platform Tauri shell!    | _Researching_                                                           | Seems viable _so_ far...                                                            |
| [`@cutout/agent`](./agent/)   | QDT-compliant local LLM service.                                 | _Partially Implemented_                                                 | **Shim**: run with `deno task --cwd=agent start`, but it doesn't do much currently. |

### Who we are

[Cutout Studios](https://cutoutstudios.com/) is a Philadelphia-based creative
studio focused on building experiences for personal growth.

## Contributing

**Interested in contributing?** See our [Contribution Guide](./CONTRIBUTING.md).

---

[Copyright 2026, Cutout Studios](./LICENSE)
