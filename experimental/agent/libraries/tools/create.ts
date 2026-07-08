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
  Object.defineProperty(handler, "name", { value: name });
  Object.assign(handler, { description, parameters });

  return handler as Tool;
}

export function createCall(
  tool: Tool,
  parameters: AnyShape,
  id: number,
): ToolCall {
  const toolCall = () => tool(parameters);

  Object.defineProperty(toolCall, "name", {
    value: `${tool.name}(${JSON.stringify(parameters)})`,
  });
  Object.assign(toolCall, { id });

  return toolCall as ToolCall;
}
