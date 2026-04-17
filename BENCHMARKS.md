# `@cutout/jsx` Rendering Benchmarks

_Last updated: April 2026_

## Methodology

The benchmark is a head to head of both React's and `@cutout/jsx` respective
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
| 10K rows  | server-side              | **13.0 ms**   | 18.4 ms | **Cutout (1.42×)**        |
| 10K rows  | server-side, constrained | **54.2 ms**   | 58.8 ms | **Cutout (1.08×)**        |
| wikipedia | server-side              | 2.4 ms        | 2.0 ms  | React (1.18×)<sup>†</sup> |
| wikipedia | server-side, constrained | 5.4 ms        | 9.3 ms  | React (1.73×)             |

> <sup>†</sup>Worth noting that `@cutout/jsx` still wins considerably here in
> worst-case scenarios _(p99)_, making it the safer choice. See the
> `Full Results` below.

## Full Results

```
    CPU | Apple M5 Max
Runtime | Deno 2.7.5 (aarch64-apple-darwin)

| benchmark                 | time/iter (avg) |        iter/s |      (min … max)      |      p75 |      p99 |     p995 |
| ------------------------- | --------------- | ------------- | --------------------- | -------- | -------- | -------- |

group [SSR] wikipedia HTML
| react-dom/server          |          2.0 ms |         487.9 | (  1.1 ms …  23.0 ms) |   1.2 ms |  22.5 ms |  22.6 ms |
| @cutout/jsx/format/html   |          2.4 ms |         414.2 | (  2.1 ms …   5.3 ms) |   2.4 ms |   3.5 ms |   3.5 ms |

summary
  @cutout/jsx/format/html
     1.18x slower than react-dom/server

group [SSR] 10K rows
| react-dom/server          |         18.4 ms |          54.3 | ( 16.7 ms …  39.5 ms) |  18.0 ms |  39.5 ms |  39.5 ms |
| @cutout/jsx/format/html   |         13.0 ms |          77.2 | ( 11.7 ms …  20.6 ms) |  13.4 ms |  20.6 ms |  20.6 ms |

summary
  @cutout/jsx/format/html
     1.42x faster than react-dom/server

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

group [SSR] wikipedia HTML
| react-dom/server          |          5.4 ms |         185.7 | (  4.3 ms …  10.6 ms) |   4.9 ms |   9.8 ms |  10.6 ms |
| @cutout/jsx/format/html   |          9.3 ms |         107.2 | (  8.7 ms …  11.3 ms) |   9.4 ms |  11.3 ms |  11.3 ms |

summary
  @cutout/jsx/format/html
     1.73x slower than react-dom/server

group [SSR] 10K rows
| react-dom/server          |         58.8 ms |          17.0 | ( 56.4 ms …  79.3 ms) |  58.7 ms |  79.3 ms |  79.3 ms |
| @cutout/jsx/format/html   |         54.2 ms |          18.4 | ( 52.7 ms …  55.6 ms) |  54.9 ms |  55.6 ms |  55.6 ms |

summary
  @cutout/jsx/format/html
     1.08x faster than react-dom/server
```
