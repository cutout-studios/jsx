import type { Tool, ToolCall, ToolParameter } from "./types.ts";

type Options<I, O> = {
  name: string;
  description: string;
  parameters: ToolParameter[];
  handler: (parameters: I) => O;
};

export function create<I, O>({
  name,
  description,
  parameters,
  handler,
}: Options<I, O>): Tool<I, O> {
  return Object.assign(handler, {
    name,
    description,
    parameters,
  });
}

export function createCall<I, O>(
  tool: Tool<I, O>,
  parameters: I,
  id: number,
): ToolCall<O> {
  return Object.assign(() => tool(parameters), {
    id,
    name: tool.name,
  });
}
