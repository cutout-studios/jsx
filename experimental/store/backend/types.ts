import type {
  CutoutBooleanToken,
  CutoutIdentifierToken,
  CutoutNullToken,
  CutoutPrimitiveToken,
  CutoutPromiseToken,
  CutoutSyntaxToken,
} from "@cutout/jsx/tokens";

export type TokenSegment =
  | CutoutPrimitiveToken
  | CutoutSyntaxToken
  | CutoutIdentifierToken;
export type TokenPath = TokenSegment[];

export type ListOptions = {
  limit?: number;
};

export interface Backend {
  has(path: TokenPath): CutoutBooleanToken;
  add(path: TokenPath): CutoutPromiseToken | CutoutNullToken;
  list(
    prefix: TokenPath,
    options?: ListOptions,
  ): Generator<TokenPath | CutoutPromiseToken> | undefined;
  delete(path: TokenPath): CutoutPromiseToken | CutoutBooleanToken;
}
