import type { Backend, BackendKey } from "./types.ts";

export class MemoryBackend implements Backend {
  constructor(entries: [BackendKey[], BackendKey][]) {

  }

  get(keyPath: BackendKey[], options: { limit: 1 }): BackendKey[][] {
    return [];
  }

  set(keyPath: BackendKey[], value: BackendKey): void {
    
  }

  delete(keyPath: BackendKey[]): void {

  }
}
