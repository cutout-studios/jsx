import type { AnyCutoutToken } from "@cutout/jsx/tokens";

export interface Store<K = AnyCutoutToken, V = K, O = V> {
  has(key: K[]): boolean;
  get(key: K[]): O;
  set(key: K[], value: V[]): void;
  delete(key: K[]): boolean;
}
