import type { ToolCall } from "@cutout/agent/tools";

import type { Role } from "./constants.ts";

export type Message = {
  role: Role;
  content?: string;
  toolCalls?: ToolCall[];
  toolCallID?: number;
};

export type GenerationOptions = {
  limit?: number;
  sampling?: {
    temperature?: number;
    probability?: {
      top?: number;
      min?: number;
    };
    count?: {
      top?: number;
    };
  };
  repetition?: {
    penalty?: number;
    size?: number;
  };
  presence?: {
    penalty?: number;
    size?: number;
  };
  frequency?: {
    penalty?: number;
    size?: number;
  };
};
