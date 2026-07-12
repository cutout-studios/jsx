export enum Combinator {
  LIST = ",",
  DESCENDANT = " ",
  CHILD = ">",
  NEXT = "+",
  SUBSEQUENT = "~",
  COLUMN = "||",
}

export enum AttributeOperator {
  EQUALS = "=",
  IN_LIST = "~=",
  IN_TEXT = "*=",
  STARTS_WITH = "^=",
  ENDS_WITH = "$]=",
}
