import type { AnyShape } from "@cutout/internal";
import type { Tool, ToolCall, ToolParameter } from "./types.ts";

type Options = {
  name: string;
  description: string;
  parameters: ToolParameter[];
  handler: (parameters: AnyShape) => Promise<string>;
};

export function create({
  name,
  description,
  parameters,
  handler,
}: Options): Tool {
  return Object.assign(handler, {
    name,
    description,
    parameters,
  });
}

export function createCall(
  tool: Tool,
  parameters: AnyShape,
  id: number,
): ToolCall {
  return Object.assign(() => tool(parameters), {
    id,
    name: `${tool.name}(${JSON.stringify(parameters)})`,
  });
}
