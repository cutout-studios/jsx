# `@cutout/jsx` Benchmarks

TODO: string optimizations?

## Results

```
    CPU | Apple M5 Max
Runtime | Deno 2.7.5 (aarch64-apple-darwin)

| benchmark                                        | time/iter (avg) |        iter/s |      (min … max)      |      p75 |      p99 |     p995 |
| ------------------------------------------------ | --------------- | ------------- | --------------------- | -------- | -------- | -------- |

group wikipedia.org (no style/script tags) - dom
| format/dom via happy-dom - wikipedia.org         |         10.7 ms |          93.1 | (  9.0 ms …  19.9 ms) |  10.8 ms |  19.9 ms |  19.9 ms |
react-dom/client via happy-dom - wikipedia.org: In HTML, <html> cannot be a child of <html>.
This will cause a hydration error.
| react-dom/client via happy-dom - wikipedia.org   |         15.6 ms |          64.3 | ( 11.8 ms …  34.6 ms) |  16.2 ms |  34.6 ms |  34.6 ms |

summary
  format/dom via happy-dom - wikipedia.org
     1.45x faster than react-dom/client via happy-dom - wikipedia.org

group 10000 rows - dom
| format/dom via happy-dom - 10000 rows            |         68.1 ms |          14.7 | ( 63.0 ms …  76.0 ms) |  70.0 ms |  76.0 ms |  76.0 ms |
| react-dom/client via happy-dom - 10000 rows      |         87.7 ms |          11.4 | ( 80.4 ms … 107.5 ms) |  94.7 ms | 107.5 ms | 107.5 ms |

summary
  format/dom via happy-dom - 10000 rows
     1.29x faster than react-dom/client via happy-dom - 10000 rows

group wikipedia.org (no style/script tags) - string
| format/html - wikipedia.org                      |          2.3 ms |         427.8 | (  2.1 ms …   3.5 ms) |   2.3 ms |   3.4 ms |   3.4 ms |
| react-dom/server - wikipedia.org                 |          1.7 ms |         579.8 | (  1.1 ms …  23.1 ms) |   1.2 ms |  21.9 ms |  21.9 ms |

summary
  format/html - wikipedia.org
     1.35x slower than react-dom/server - wikipedia.org

group 10000 rows - string
| format/html - 10000 rows                         |         13.4 ms |          74.9 | ( 11.4 ms …  29.4 ms) |  13.6 ms |  29.4 ms |  29.4 ms |
| react-dom/server - 10000 rows                    |         18.3 ms |          54.5 | ( 16.9 ms …  39.9 ms) |  17.8 ms |  39.9 ms |  39.9 ms |

summary
  format/html - 10000 rows
     1.37x faster than react-dom/server - 10000 rows
```

## Mobile-friendly Results

_JIT-less v8, Lite mode_