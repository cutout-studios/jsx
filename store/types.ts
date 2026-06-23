import {
  CutoutNumberToken,
  CutoutStringToken,
  CutoutSymbolToken,
} from "@cutout/jsx/tokens";

type ValidStoreToken =
  | CutoutStringToken
  | CutoutSymbolToken
  | CutoutNumberToken;

type StoreKey = ValidStoreToken[];
type StoreValue = ValidStoreToken;

export interface Store {
  has(key: StoreKey): boolean;
  get(key: StoreKey): StoreValue;
  set(key: StoreKey): StoreValue;
  delete(key: StoreKey): void;
}
