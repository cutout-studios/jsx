import { type CutoutIR, CutoutIRTags, type CutoutNode, isCutoutNode } from "./types.ts";

export const Fragment = Symbol("Fragment");

export const jsx = (
  type: string | (() => unknown),
  props: { [key: string]: unknown },
): CutoutIR => {
  const values = new Map<unknown, number>([[Fragment, 0x00]]);
  const index: number[] = [];

  const _pushValue = (value: unknown) => {
    let id = values.get(value);

    if (id === undefined) {
      id = values.size;
      values.set(value, id);
    }

    index.push(id);
  };

  const stack: unknown[] = [];
  const _stackNode = ({ type, props }: CutoutNode) => {
    stack.push(CutoutIRTags.END_NODE);

    for (const key in props) {
      stack.push(props[key], key);
    }

    stack.push(type, CutoutIRTags.START_NODE);
  };

  _stackNode({ type, props });
  while (stack.length) {
    const element = stack.pop();

    if (isCutoutNode(element)) {
      _stackNode(element);
    } else if (Array.isArray(element) && element.every(isCutoutNode)) {
      for (const subelement of element) {
        _stackNode(subelement);
      }
    } else {
      _pushValue(element);
    }
  }

  return {
    values: Array.from(values.keys()),
    index: new Uint16Array(index),
  };
};

// Just pass these through for now
export const jsxs = jsx;
export const jsxDEV = jsx;
