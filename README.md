# ✂️ The Cutout Toolbox 🧰

[![Maintainability](https://qlty.sh/badges/63ab5737-a9d3-4598-855e-83c7fe779ec6/maintainability.svg)](https://qlty.sh/gh/cutout-studios/projects/jsx)
[![Code Coverage](https://qlty.sh/badges/63ab5737-a9d3-4598-855e-83c7fe779ec6/coverage.svg)](https://qlty.sh/gh/cutout-studios/projects/jsx)

A collection of NPM-free tools for building cross-platform webapps. JSX, web
components, UI primitives, and a native shell: all designed to stay as close as
possible to their respective targets.

## Contents

### Core

| Module                  | Description                                                      | Status    | Release                                                                 |
| ----------------------- | ---------------------------------------------------------------- | --------- | ----------------------------------------------------------------------- |
| [`@cutout/jsx`](./jsx/) | **_Write JSX once, use it anywhere._** Cutout's rendering layer. | **Alpha** | [![JSR](https://jsr.io/badges/@cutout/jsx)](https://jsr.io/@cutout/jsx) |

### Experimental

> [!CAUTION]
> Currently these tools are either speculative and/or untested: not yet for
> production use.

| Module                                   | Description                                                                                                                                                 | Status                         | Notes                                                                                |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------ |
| `@cutout/web`                            | **_A full-stack framework will intends to fully leverage `@cutout/jsx`'s IR and Deno's awesome @std library._** Think Next.js but for Deno + WebComponents. | **Pending re-implementation.** | **Est. alpha release: August 2026**                                                  |
| [`@cutout/tauri`](./experimental/tauri/) | Embed your `@cutout/web` app in a cross-platform Tauri shell!                                                                                               | _Researching_                  | Seems viable _so_ far...                                                             |
| [`@cutout/agent`](./experimental/agent/) | [QDT-compliant](https://cutoutstudios.com/llm-use/) local LLM service.                                                                                      | _Partially Implemented_        | **Shim**: run with `deno run -A @cutout/agent`, but there's minimal QDT enforcement. |

## Contributing

**Interested in contributing?** See our
[Contribution Guide](https://github.com/cutout-studios/toolbox/blob/main/CONTRIBUTING.md).

### Who we are

[Cutout Studios](https://cutoutstudios.com/) is a Philadelphia-based creative
studio focused on building experiences for personal growth.

---

[Copyright 2026, Cutout Studios](https://github.com/cutout-studios/toolbox/blob/main/LICENSE)
