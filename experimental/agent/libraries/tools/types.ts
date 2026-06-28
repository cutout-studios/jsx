export type Tool<T = unknown> = () => T & {
  name: string;
  description: string;
  parameters: Record<string, {}>; // TODO: infer parameters
};
