import { readEnv } from "@cutout/internal";

export const CHAT_MODEL = readEnv(
  "XO_AGENT_CHAT_MODEL",
  "mlx-community/Qwen3.6-35B-A3B-mxfp8",
);

export const SCORE_MODEL = readEnv(
  "XO_AGENT_SCORING_MODEL",
  "Unbabel/M-Prometheus-14B",
);
