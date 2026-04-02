export type CutoutNode<
  T = string | (() => unknown),
  P = Record<string, unknown>,
> = {
  type: T;
  props: P & { children?: CutoutNode<T, P>[] };
};

export type CutoutIR<V = unknown> = {
  values: V[];
  index: Uint16Array;
};

// TODO: In production, escape these values.
export enum CutoutIRTags {
  START_NODE = "__NODE__",
  END_NODE = "/__NODE__",
}

export const isCutoutNode = (value: unknown): value is CutoutNode =>
  Boolean(
    value && typeof value === "object" && "type" in value && "props" in value,
  );
