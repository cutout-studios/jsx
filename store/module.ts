import {
  CutoutNumberToken,
  CutoutStringToken,
  CutoutSymbolToken,
} from "@cutout/jsx/tokens";

type ValidStoreToken =
  | CutoutStringToken
  | CutoutSymbolToken
  | CutoutNumberToken;

export class Store implements Map<ValidStoreToken[], ValidStoreToken> {
  constructor() {
  }

  get() {
  }

  set() {
  }
}
