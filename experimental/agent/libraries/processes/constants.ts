export const LOG_ROOT = "./.output/processes/";

export const MODEL_PROCESS_COMMAND = "mlx_lm.server";
export const MODEL_GENERATION_ENDPOINT = "chat/completions";
export const MODEL_GENERATION_DEFAULT_RESPONSE_LENGTH_LIMIT = 16384;
export const MODEL_GENERATION_DEFAULT_TEMPERATURE = 0.7;
export const MODEL_GENERATION_DEFAULT_PROBABILITY_CUTOFF = 0.95;
export const MODEL_GENERATION_DEFAULT_PRESENCE_PENALTY = 1.5;
export const MODEL_GENERATION_DEFAULT_OPTION_LIMIT = 20;
export const MODEL_DEFAULT_LOGFILE = "model.log";

export enum ModelRole {
  MODEL = "model",
  SYSTEM = "system",
  TOOL = "tool",
  USER = "user",
}

export const REQUIRED_COMMANDS = [MODEL_PROCESS_COMMAND];
