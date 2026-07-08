import { readEnv } from "@cutout/internal";
import { load } from "@std/dotenv";

await load();

const AGENT_TAG = "XO_AGENT";

let PREFIX = `${AGENT_TAG}_MODEL`;

export const MODEL_AGENT = readEnv(
  `${PREFIX}__AGENT`,
  [
    "mlx-community/Qwen3.6-35B-A3B-mxfp8", // 36.7GB
    "mlx-community/Qwen3.6-35B-A3B-4bit", // 20GB
    "mlx-community/Qwen3.6-27B-4bit", // 16GB
  ],
);

export const MODEL_JUDGE = readEnv(
  `${PREFIX}__JUDGE`,
  [
    "Unbabel/M-Prometheus-14B", // 29.6GB
    "Unbabel/M-Prometheus-7B", // 15.2GB
    "Unbabel/M-Prometheus-3B", // 6.18GB
  ],
);

PREFIX = `${AGENT_TAG}_MEMORY`;

export const MEMORY_BREAKPOINTS = readEnv(
  `${PREFIX}__BREAKPOINTS`,
  [128, 64, 32],
);

export const LOG_LEVEL = readEnv<string>(
  "LOG_LEVEL",
  "INFO",
);
