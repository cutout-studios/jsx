import type { ToolCall } from "@cutout/agent/tools";

import type { Role } from "./constants.ts";

export type Message = {
  role: Role;
  content?: string;
  toolCalls?: ToolCall[];
  toolCallID?: number;
};
