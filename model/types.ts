export enum CutoutTypeAnnotation {
  ARRAY = "ARRAY",
  BOOLEAN = "BOOLEAN",
  CHILDREN = "CHILDREN",
  ELEMENT_OPEN = "ELEMENT_OPEN",
  ELEMENT_CLOSE = "ELEMENT_CLOSE",
  // FRAGMENT = "FRAGMENT",
  FUNCTION = "FUNCTION",
  GENERATOR = "GENERATOR",
  NULL = "NULL",
  NUMBER = "NUMBER",
  OBJECT = "OBJECT",
  PROPERTY = "PROPERTY",
  STRING = "STRING",
  SYMBOL = "SYMBOL",
  UNDEFINED = "UNDEFINED",
  UNKNOWN = "UNKOWN",
}

export type AnyCutoutToken<
  A extends CutoutTypeAnnotation = CutoutTypeAnnotation.UNKNOWN,
  T = unknown,
> = [A, T];

export type UnknownCutoutToken = AnyCutoutToken<
  CutoutTypeAnnotation.UNKNOWN,
  unknown
>;

export type CutoutNumberToken = AnyCutoutToken<
  CutoutTypeAnnotation.NUMBER,
  number
>;
export type CutoutStringToken = AnyCutoutToken<
  CutoutTypeAnnotation.STRING,
  string
>;
export type CutoutBooleanToken = AnyCutoutToken<
  CutoutTypeAnnotation.BOOLEAN,
  boolean
>;
export type CutoutObjectToken = AnyCutoutToken<
  CutoutTypeAnnotation.OBJECT,
  object
>;
export type CutoutFunctionToken = AnyCutoutToken<
  CutoutTypeAnnotation.FUNCTION,
  Function
>;
export type CutoutElementOpenToken = AnyCutoutToken<
  CutoutTypeAnnotation.ELEMENT_OPEN,
  string
>;
export type CutoutElementCloseToken = AnyCutoutToken<
  CutoutTypeAnnotation.ELEMENT_CLOSE,
  string
>;
export type CutoutPropertyToken = AnyCutoutToken<
  CutoutTypeAnnotation.PROPERTY,
  string
>;
// export type CutoutFragmentToken = AnyCutoutToken<
//   CutoutTypeAnnotation.FRAGMENT,
//   null
// >;
export type CutoutChildrenToken = AnyCutoutToken<CutoutTypeAnnotation.CHILDREN, number>;
export type CutoutArrayToken = AnyCutoutToken<
  CutoutTypeAnnotation.ARRAY,
  Array<unknown>
>;
export type CutoutNullToken = AnyCutoutToken<CutoutTypeAnnotation.NULL, null>;
export type CutoutUndefinedToken = AnyCutoutToken<
  CutoutTypeAnnotation.UNDEFINED,
  undefined
>;
export type CutoutSymbolToken = AnyCutoutToken<
  CutoutTypeAnnotation.SYMBOL,
  symbol
>;
export type CutoutGeneratorToken = AnyCutoutToken<
  CutoutTypeAnnotation.GENERATOR,
  Generator<ValidCutoutToken>
>;

export type ValidCutoutToken =
  | CutoutArrayToken
  | CutoutBooleanToken
  | CutoutChildrenToken
  | CutoutElementCloseToken
  | CutoutElementOpenToken
  // | CutoutFragmentToken
  | CutoutFunctionToken
  | CutoutGeneratorToken
  | CutoutNullToken
  | CutoutNumberToken
  | CutoutObjectToken
  | CutoutPropertyToken
  | CutoutStringToken
  | CutoutSymbolToken
  | CutoutUndefinedToken;
