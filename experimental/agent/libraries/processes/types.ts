import type { ModelRole } from "./constants.ts";

export type Message = {
  role: ModelRole;
  content: string;
  toolCalls?: ToolCall[];
  toolCallID?: number;
};

export type ToolCall<T = unknown> = () => T & {
  id: string;
  name: string;
};
