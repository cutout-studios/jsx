export type BackendKey = string | number | symbol;

export type BackendGetterOptions = {
  limit?: number;
}

export interface Backend {
  get(keyPath: BackendKey[], options: BackendGetterOptions): BackendKey[][];
  set(keyPath: BackendKey[], value: BackendKey): void;
  delete(keyPath: BackendKey[]): void;
}
