import { readEnv } from "@cutout/internal";

const AGENT_TAG = "XO_AGENT";

let PREFIX = `${AGENT_TAG}_MODEL`;

export const MODEL_CHAT = readEnv(
  `${PREFIX}__CHAT`,
  "mlx-community/Qwen3.6-35B-A3B-mxfp8",
);

export const MODEL_SCORE = readEnv(
  `${PREFIX}__SCORING`,
  "Unbabel/M-Prometheus-14B",
);

PREFIX = `${AGENT_TAG}_MEMORY`;

export const MEMORY_TOLERANCE = readEnv(
  `${PREFIX}__TOLERANCE`,
  0.7,
);

export const MEMORY_LIMIT = readEnv(
  `${PREFIX}__LIMIT_GB"`,
  64,
);

export const MEMORY_WARNING = readEnv(
  `${PREFIX}__WARNING_GB`,
  96,
);

export const LOG_LEVEL = readEnv(
  "LOG_LEVEL",
  "DEBUG",
);
