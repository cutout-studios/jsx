import type { AttributeOperator, Combinator } from "./constants.ts";

type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> =
  & Partial<T>
  & U[keyof U];

export type Selector =
  & AtLeastOne<{
    tag: string;
    id: string;
    classNames: Set<string>;
    attribute: AttributeSelector;
  }>
  & {
    combinator?: Combinator;
    child?: Selector;
  };

export type AttributeSelector = {
  key: string;
  value?: string;
  operator?: AttributeOperator;
  caseSensitive?: boolean;
};
