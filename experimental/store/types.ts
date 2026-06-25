import {
  type CutoutPrimitiveToken,
  type CutoutSyntaxToken,
} from "@cutout/jsx/tokens";

export type ValidStoreToken =
  | CutoutPrimitiveToken
  | CutoutSyntaxToken;

export interface Store {
  has(key: ValidStoreToken[]): boolean;
  get(key: ValidStoreToken[]): ValidStoreToken[] | undefined;
  set(key: ValidStoreToken[], value: ValidStoreToken[]): void;
  delete(key: ValidStoreToken[]): boolean;
}
