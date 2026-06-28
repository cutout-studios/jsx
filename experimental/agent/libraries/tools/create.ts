import type { Tool, ToolParameter } from "./types.ts";

type CreationOptions<I, O> = {
  name: string;
  description: string;
  parameters: ToolParameter[];
  handler: (parameters: I) => O;
};

export function createTool<I, O>({
  name,
  description,
  parameters,
  handler,
}: CreationOptions<I, O>): Tool<I, O> {
  return Object.assign(handler, {
    name,
    description,
    parameters,
  });
}
