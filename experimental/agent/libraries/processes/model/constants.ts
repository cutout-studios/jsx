export enum Role {
  MODEL = "assistant",
  SYSTEM = "system",
  TOOL = "tool",
  USER = "user",
}

export const REGISTRY_COMMAND = "hf";
export const PROCESS_COMMAND = "mlx_lm.server";
export const REQUIRED_COMMANDS = [REGISTRY_COMMAND, PROCESS_COMMAND];

export const GENERATION_ENDPOINT = "chat/completions";
export const DEFAULT_LOGFILE = "model.log";
