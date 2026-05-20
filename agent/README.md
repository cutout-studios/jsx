# `@cutout/agent`

> [!CAUTION]
> This "implementation" is a shim. We plan to wrap `llmstudio-js` with basic MCP
> support and QDT-mapped skills. See
> [Bott](https://github.com/cutout-studios/Bott/tree/main/model#reasons--ratings)
> for prior work reference.

1. Setup `llmster`:

```sh
curl -fsSL https://lmstudio.ai/install.sh | bash
lms get qwen/qwen3.6-35b-a3b
```

2. Execute the task:

```sh
deno task --cwd=agent start
```

---

[Copyright 2026, Cutout Studios](https://github.com/cutout-studios/toolbox/blob/main/LICENSE)
