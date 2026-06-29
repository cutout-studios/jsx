export enum Role {
  MODEL = "model",
  SYSTEM = "system",
  TOOL = "tool",
  USER = "user",
}

export const REGISTRY_COMMAND = "hf";
export const PROCESS_COMMAND = "mlx_lm.server";
export const REQUIRED_COMMANDS = [REGISTRY_COMMAND, PROCESS_COMMAND];

export const GENERATION_ENDPOINT = "chat/completions";
export const GENERATION_DEFAULT_RESPONSE_LENGTH_LIMIT = 16384;
export const GENERATION_DEFAULT_TEMPERATURE = 0.7;
export const GENERATION_DEFAULT_PROBABILITY_CUTOFF = 0.95;
export const GENERATION_DEFAULT_PRESENCE_PENALTY = 1.5;
export const GENERATION_DEFAULT_OPTION_LIMIT = 20;
export const DEFAULT_LOGFILE = "model.log";
