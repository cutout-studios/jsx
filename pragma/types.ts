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

export enum CutoutIRTags {
  START_PROPS = "props",
  END_PROPS = "/props",
  START_CHILDREN = "children",
  END_CHILDREN = "/children",
}
