import type {
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
  add(path: TokenPath): CutoutPromiseToken | CutoutNullToken;
  list(
    prefix: TokenPath,
  ): Generator<TokenPath | CutoutPromiseToken> | undefined;
}
