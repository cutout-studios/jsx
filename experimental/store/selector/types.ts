import type {
  CutoutAttributeToken,
  CutoutElementToken,
  CutoutStringToken,
} from "@cutout/jsx/tokens";
import type { AttributeOperator, Combinator } from "./constants.ts";

export type Selector = {
  tag?: CutoutElementToken;
  attributes: AttributeSelector[];
  combinator?: Combinator;
  child?: Selector;
};

export type AttributeSelector = {
  key: CutoutAttributeToken;
  value?: CutoutStringToken;
  operator?: AttributeOperator;
  caseSensitive?: boolean;
};
