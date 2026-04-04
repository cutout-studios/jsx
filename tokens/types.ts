export enum CutoutTokenType {
  ARRAY = "ARRAY",
  BOOLEAN = "BOOLEAN",
  ELEMENT_OPEN = "ELEMENT_OPEN",
  ELEMENT_CLOSE = "ELEMENT_CLOSE",
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
  A extends CutoutTokenType = CutoutTokenType.UNKNOWN,
  T = unknown,
> = [A, T];

export type UnknownCutoutToken = AnyCutoutToken<
  CutoutTokenType.UNKNOWN,
  unknown
>;

export type CutoutNumberToken = AnyCutoutToken<
  CutoutTokenType.NUMBER,
  number
>;
export type CutoutStringToken = AnyCutoutToken<
  CutoutTokenType.STRING,
  string
>;
export type CutoutBooleanToken = AnyCutoutToken<
  CutoutTokenType.BOOLEAN,
  boolean
>;
export type CutoutObjectToken = AnyCutoutToken<
  CutoutTokenType.OBJECT,
  object
>;
export type CutoutFunctionToken = AnyCutoutToken<
  CutoutTokenType.FUNCTION,
  // "Function" is the appropriate value here - we actually want any class or function.
  // deno-lint-ignore ban-types
  Function
>;
export type CutoutElementOpenToken = AnyCutoutToken<
  CutoutTokenType.ELEMENT_OPEN,
  string
>;
export type CutoutElementCloseToken = AnyCutoutToken<
  CutoutTokenType.ELEMENT_CLOSE,
  string
>;
export type CutoutPropertyToken = AnyCutoutToken<
  CutoutTokenType.PROPERTY,
  string
>;
export type CutoutArrayToken = AnyCutoutToken<
  CutoutTokenType.ARRAY,
  Array<unknown>
>;
export type CutoutNullToken = AnyCutoutToken<CutoutTokenType.NULL, null>;
export type CutoutUndefinedToken = AnyCutoutToken<
  CutoutTokenType.UNDEFINED,
  undefined
>;
export type CutoutSymbolToken = AnyCutoutToken<
  CutoutTokenType.SYMBOL,
  symbol
>;
export type CutoutGeneratorToken = AnyCutoutToken<
  CutoutTokenType.GENERATOR,
  Generator<ValidCutoutToken>
>;

export type ValidCutoutToken =
  | CutoutArrayToken
  | CutoutBooleanToken
  | CutoutElementCloseToken
  | CutoutElementOpenToken
  | CutoutFunctionToken
  | CutoutGeneratorToken
  | CutoutNullToken
  | CutoutNumberToken
  | CutoutObjectToken
  | CutoutPropertyToken
  | CutoutStringToken
  | CutoutSymbolToken
  | CutoutUndefinedToken;
