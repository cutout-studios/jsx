# `@cutout/jsx` Rendering Benchmarks

_Last updated: April 2026_

## Methodology

The benchmark is a head to head of both React's and `@cutout/jsx`'s respective
rendering methods. Framework-based features - like streaming - are out of scope.

All implementations are currently set up to render both:

1. A "real-world" scenario (the [wikipedia.org](https://wikipedia.org/) source
   HTML)
2. A synthetic "heavy-data" scenario - 10K randomly generated rows.

The JSX source files per implementation had to be separated due to differing
runtimes, but contain identical contents otherwise.

### Environments Tested

- `client-side` - Powered by a `happy-dom` Window with minimal APIs exposed to
  the Deno process.
- `server-side` - Just the Deno process.
- `server-side, constrained` - The Deno process run with
  `--v8-flags="--jitless,--lite-mode"`, for embedding on mobile devices.

## Summary

| Scenario  | Environment              | `@cutout/jsx` | React   | Winner                    |
| --------- | ------------------------ | ------------- | ------- | ------------------------- |
| wikipedia | client-side              | **10.0 ms**   | 20.6 ms | **Cutout (2.07×)**        |
| 10K rows  | client-side              | **57.0 ms**   | 97.4 ms | **Cutout (1.71×)**        |
| 10K rows  | server-side              | **12.3 ms**   | 18.3 ms | **Cutout (1.49×)**        |
| 10K rows  | server-side, constrained | **54.2 ms**   | 58.8 ms | **Cutout (1.08×)**        |
| wikipedia | server-side              | 2.4 ms        | 2.2 ms  | React (1.08×)<sup>†</sup> |
| wikipedia | server-side, constrained | 8.9 ms        | 5.5 ms  | React (1.63×)             |

> <sup>†</sup>Worth noting that `@cutout/jsx` still wins considerably here in
> worst-case scenarios _(p99)_, making it the safer choice. See the
> `Full Results` below.

### Why do constrained evironments underperform?

In standard V8, deeply nested generators are heavily optimized — roughly the
opposite of what happens in jitless/lite mode, where ~75% of render time is
spent inside the generator state machine itself (measured: `_forwardTokens` +
`_generator` self time, with an associated bump in GC). If we were to roll our
own generators or move away from them it would penalize our performance
elsewhere.

So to fix this we would need to maintain a separate `@cutout/jsx/lite` pragma;
however, given that eager token evaluation can potentially be done downstream
based on a given frameworks' needs, we're exploring that path first.

## Full Results

```
    CPU | Apple M5 Max
Runtime | Deno 2.7.5 (aarch64-apple-darwin)

| benchmark                 | time/iter (avg) |        iter/s |      (min … max)      |      p75 |      p99 |     p995 |
| ------------------------- | --------------- | ------------- | --------------------- | -------- | -------- | -------- |

group [SSR] wikipedia.org home page
| react-dom/server          |          2.2 ms |         446.9 | (  1.1 ms …  22.8 ms) |   1.2 ms |  22.6 ms |  22.8 ms |
| @cutout/jsx/format/html   |          2.4 ms |         413.5 | (  2.1 ms …   5.3 ms) |   2.4 ms |   4.2 ms |   4.2 ms |

summary
  @cutout/jsx/format/html
     1.08x slower than react-dom/server

group [SSR] 10K rows
| react-dom/server          |         18.3 ms |          54.7 | ( 16.7 ms …  37.7 ms) |  18.1 ms |  37.7 ms |  37.7 ms |
| @cutout/jsx/format/html   |         12.3 ms |          81.3 | ( 10.8 ms …  21.2 ms) |  12.2 ms |  21.2 ms |  21.2 ms |

summary
  @cutout/jsx/format/html
     1.49x faster than react-dom/server

group [SPA] wikipedia HTML
| @cutout/jsx/format/dom    |         10.0 ms |         100.2 | (  8.4 ms …  20.8 ms) |  10.4 ms |  20.8 ms |  20.8 ms |
| react-dom/client          |         20.6 ms |          48.5 | ( 12.1 ms …  39.2 ms) |  36.0 ms |  39.2 ms |  39.2 ms |

summary
  @cutout/jsx/format/dom
     2.07x faster than react-dom/client

group [SPA] 10K rows
| @cutout/jsx/format/dom    |         57.0 ms |          17.5 | ( 53.5 ms …  64.9 ms) |  57.7 ms |  64.9 ms |  64.9 ms |
| react-dom/client          |         97.4 ms |          10.3 | ( 88.4 ms … 118.0 ms) | 108.8 ms | 118.0 ms | 118.0 ms |

summary
  @cutout/jsx/format/dom
     1.71x faster than react-dom/client
```

### Constrained Runtime

```
    CPU | Apple M5 Max
Runtime | Deno 2.7.5 (aarch64-apple-darwin)

| benchmark                 | time/iter (avg) |        iter/s |      (min … max)      |      p75 |      p99 |     p995 |
| ------------------------- | --------------- | ------------- | --------------------- | -------- | -------- | -------- |

group [SSR] wikipedia.org home page
| react-dom/server          |          5.5 ms |         183.4 | (  4.3 ms …  10.9 ms) |   4.9 ms |  10.1 ms |  10.9 ms |
| @cutout/jsx/format/html   |          8.9 ms |         112.4 | (  8.3 ms …  10.6 ms) |   8.8 ms |  10.6 ms |  10.6 ms |

summary
  @cutout/jsx/format/html
     1.63x slower than react-dom/server

group [SSR] 10K rows
| react-dom/server          |         57.8 ms |          17.3 | ( 55.8 ms …  77.5 ms) |  57.8 ms |  77.5 ms |  77.5 ms |
| @cutout/jsx/format/html   |         50.4 ms |          19.8 | ( 49.0 ms …  52.4 ms) |  50.8 ms |  52.4 ms |  52.4 ms |

summary
  @cutout/jsx/format/html
     1.15x faster than react-dom/server
```
