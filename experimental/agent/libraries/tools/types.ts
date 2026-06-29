export type Tool<I = Record<string, unknown>, O = unknown> =
  & ((parameters: I) => O)
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
