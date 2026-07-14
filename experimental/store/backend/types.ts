import type {
  CutoutBooleanToken,
  CutoutNullToken,
  CutoutPrimitiveToken,
  CutoutPromiseToken,
} from "@cutout/jsx/tokens";

type Awaitable<T> = T | Promise<T>;

export type TokenSegment = CutoutPrimitiveToken;
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
