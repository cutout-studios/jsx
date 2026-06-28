export type Tool<I, O> = ((parameters: I) => O) & {
  name: string;
  description: string;
  parameters: ToolParameter[];
};

export type ToolParameter = {
  name: string;
  type: typeof String | typeof Number;
  description: string;
  required: boolean;
};
