export const TAG_REGEX = /^\w[-.\w]+/;

// TODO: these can contain CSS.escape()'d characters, technically
export const ID_REGEX = /\#[-\w]+/;
export const CLASS_REGEX = /\.[-\w]+/;
export const ATTRIBUTE_BLOCK_REGEX = /\[(.+)\]/;

// TODO: case sensitivity
export const ATTRIBUTE_SELECTOR_REGEX =
  /(?<key>\w+)(?<operator>[$~*^]?=)?(?<value>\w+)?/;


export enum Combinator {
  LIST = ",",
  DESCENDANT = " ",
  CHILD = ">",
  NEXT = "+",
  SUBSEQUENT = "~",
  COLUMN = "||"
}

export enum AttributeOperator {
  EQUALS = "=",
  IN_LIST = "~=",
  IN_TEXT = "*=",
  STARTS_WITH = "^=",
  ENDS_WITH = "$="
}
