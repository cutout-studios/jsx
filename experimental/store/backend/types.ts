import type {
  CutoutBooleanToken,
  CutoutNullToken,
  CutoutPrimitiveToken,
  CutoutPromiseToken,
  CutoutSyntaxToken,
} from "@cutout/jsx/tokens";

export type TokenSegment = CutoutPrimitiveToken | CutoutSyntaxToken;
export type TokenPath = TokenSegment[];

export type ListOptions = {
  limit?: number;
};

export interface Backend {
  add(path: TokenPath): CutoutPromiseToken | CutoutNullToken;
  list(
    prefix: TokenPath,
    options?: ListOptions,
  ): Generator<TokenPath | CutoutPromiseToken> | undefined;
  delete(path: TokenPath): CutoutPromiseToken | CutoutBooleanToken;
}
