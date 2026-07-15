export const TAG_REGEX = /^\w[-\w]+/;

// ISSUE(#): these can contain CSS.escape()'d characters, technically
export const ID_REGEX = /\#([-\w]+)/;
export const CLASS_REGEX = /\.([-\w]+)/;
export const ATTRIBUTE_BLOCK_REGEX = /\[(.+)\]/;

export const ATTRIBUTE_SELECTOR_REGEX =
  /(?<key>[-\w]+)(?<operator>[$~*^|]?=)?(?<value>"[^"]*"|'[^']*'|[-\w]+)?(?:\s+(?<casing>[si]))?/;

export enum Combinator {
  LIST = ",",
  CHILD = ">",
  NEXT = "+",
  SUBSEQUENT = "~",
  COLUMN = "||",
  DESCENDANT = " ",
}

export enum AttributeOperator {
  EQUALS = "=",
  IN_LIST = "~=",
  IN_TEXT = "*=",
  STARTS_WITH = "^=",
  ENDS_WITH = "$=",
}
