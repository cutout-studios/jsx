import { type CutoutIR, CutoutIRTags, type CutoutNode } from "./types.ts";

export const Fragment = null;

export const jsx = (
  type: string | (() => unknown),
  props: { [key: string]: unknown },
  // TODO: support keys
): CutoutIR => {
  const values = new Map<unknown, number>([[Fragment, 0x00]]);
  const index: number[] = [];

  const _pushValue = (value: unknown) => {
    if (!values.has(value)) {
      // TODO: escape value (?)
      values.set(value, values.size);
    }

    index.push(values.get(value) as number);
  };

  const nodeStack: CutoutNode[] = [{ type, props }];
  while (nodeStack.length) {
    const { type, props } = nodeStack.pop() as CutoutNode;

    _pushValue(type);
    _pushValue(CutoutIRTags.START_PROPS);

    for (const key in props) {
      if (key === CutoutIRTags.START_CHILDREN) {
        nodeStack.push(...props[key] as CutoutNode[]);
        continue;
      }

      _pushValue(key);
      _pushValue(props[key]);
    }

    // TODO: start/end children (substack?)

    _pushValue(CutoutIRTags.END_PROPS);
  }

  return {
    values: Array.from(values.keys()),
    index: new Uint16Array(index),
  };
};

// Just pass these through for now
export const jsxs = jsx;
export const jsxDEV = jsx;
