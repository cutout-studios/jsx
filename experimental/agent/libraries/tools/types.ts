export type Tool =
  & ((parameters: Record<string, unknown>) => unknown)
  & {
    name: string;
    description: string;
    parameters: ToolParameter[];
  };

export type ToolCall<O = unknown> = (() => O) & {
  id: number;
  name: string;
};

export type ToolParameter = {
  name: string;
  type: typeof String | typeof Number;
  description: string;
  required: boolean;
};
