# `@cutout/web`

A thin library for meant for authoring Webapps that take full advantage of
[`@cutout/jsx`](https://github.com/cutout-studios/toolbox/blob/main/jsx/)'s
streaming architecture.

## Likely Requirements

- Deno 2.4+ (for `Deno.bundle`).
- Modern browsers with
  [Declarative Shadow DOM (DSD)](https://web.dev/articles/declarative-shadow-dom)
  support.

> [!CAUTION]
> `@cutout/web` is currently being implemented. Feel free to weigh in, but don't
> use anything here yet.

## Target Architecture

`@cutout/web` aspires to provide the core primitives necessary for the
development of most applications. [Read more here.](./ARCHITECTURE.md)

### Dependency reductions

With access to both Deno's standard library and `@cutout/jsx`'s versatility, the
number of third-party dependencies required to author your application is
greatly reduced:

| Concern                | React + Next.js         | `@cutout/web`         |
| ---------------------- | ----------------------- | --------------------- |
| Package management     | npm + lockfile          | URL Imports           |
| Formatting             | prettier                | `deno fmt`            |
| Linting                | eslint                  | `deno lint`           |
| Testing                | Jest                    | `deno test`           |
| Build step             | Turbopack/Webpack       | **None** (direct TSX) |
| Monorepo               | Turborepo               | Deno workspace        |
| JSX rendering          | React + renderer        | `@cutout/jsx`         |
| Routing                | File-based / App Router | `@std/http`           |
| HTTP middleware        | Route handlers          | Function composition  |
| Deployment             | Vercel                  | Deno Deploy           |
| **Total Dependencies** | Several                 | **One**               |

### Prior art studied

- **React/Next.js** - a response to these tools, while still keeping JSX parts
  familiar.
- **Vue** - JSX as alternative for achieving SFCs. Constructors-as-types from
  V2.
- **Lit** + `@lit-labs/ssr` — canonical DSD SSR reference. Architectural
  solutions to server-side component instantiation were reviewed; API surface is
  not the inspiration.
- **Enhance** — independently-built HTML-first framework. Closest
  philosophically.
- **Stencil** — compiler-based web components + SSR. Different model (build
  step, not just-in-time).
- **Fresh** — Deno-native framework but Preact + islands, not web components.
- **HTMX** — server-authoritative HTML-over-the-wire pattern. Core inspiration
  for partial endpoints.

---

[Copyright 2026, Cutout Studios](https://github.com/cutout-studios/toolbox/blob/main/LICENSE)
