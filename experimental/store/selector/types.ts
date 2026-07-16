import type {
  CutoutAttributeToken,
  CutoutElementToken,
  CutoutStringToken,
} from "@cutout/jsx/tokens";
import type { AttributeOperator, Combinator } from "./constants.ts";

type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> =
  & Partial<T>
  & U[keyof U];

export type Selector =
  & AtLeastOne<{
    tag: CutoutElementToken;
    attributes: AttributeSelector[];
  }>
  & {
    combinator?: Combinator;
    parent?: Selector;
  };

export type AttributeSelector = {
  key: CutoutAttributeToken;
  value?: CutoutStringToken;
  operator?: AttributeOperator;
  caseSensitive?: boolean;
};
