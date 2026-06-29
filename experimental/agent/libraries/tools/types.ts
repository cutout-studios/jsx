export type Tool =
  & ((parameters: Record<string, unknown>) => Promise<string>)
  & {
    name: string;
    description: string;
    parameters: ToolParameter[];
  };

export type ToolCall = (() => Promise<string>) & {
  id: number;
  name: string;
};

export type ToolParameter = {
  name: string;
  type: typeof String | typeof Number;
  description: string;
  required: boolean;
};
