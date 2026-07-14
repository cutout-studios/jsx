import {
  type CutoutBooleanToken,
  type CutoutNullToken,
  CutoutTokenType,
} from "@cutout/jsx/tokens";
import type { Backend, ListOptions, TokenPath, TokenSegment } from "./types.ts";

type SerializedPathTrie = Map<string, SerializedPathTrie>;

export class MemoryBackend implements Backend {
  constructor(paths: TokenPath[]) {
    for (const path of paths) {
      this.add(path);
    }
  }

  add(path: TokenPath): CutoutNullToken {
    this.#scanCache.clear();

    let pointer = this.#pathTrie;
    for (const segment of path) {
      const segmentString = JSON.stringify(segment);

      if (!pointer.has(segmentString)) {
        pointer.set(segmentString, new Map());
      }

      pointer = pointer.get(segmentString) as SerializedPathTrie;
    }

    return [CutoutTokenType.NULL, null];
  }

  list(
    prefix: TokenPath,
    { limit = 1 }: ListOptions = {},
  ): Generator<TokenPath> | undefined {
    const options = { limit };

    const cacheKey = JSON.stringify([options, prefix]);

    if (this.#scanCache.has(cacheKey)) {
      return this.#scanCache.get(cacheKey);
    }

    const scanRoot = this.#resolvePath(prefix);

    if (!scanRoot) return;

    const result = this.#flatten(scanRoot, options);

    this.#scanCache.set(cacheKey, result);

    return (function* () {
      for (const path of result) yield path;
    })();
  }

  delete(path: TokenPath): CutoutBooleanToken {
    const [rootPath, terminalValue] = [path.slice(0, -1), path.at(-1)];

    if (!rootPath.length || !terminalValue) {
      return [CutoutTokenType.BOOLEAN, false];
    }

    const deleteRoot = this.#resolvePath(rootPath);

    if (!deleteRoot) return [CutoutTokenType.BOOLEAN, false];

    const deleteResult = deleteRoot.delete(JSON.stringify(terminalValue));

    if (deleteResult) {
      this.#scanCache.clear();
    }

    return [CutoutTokenType.BOOLEAN, deleteResult];
  }

  #pathTrie: SerializedPathTrie = new Map();
  #resolvePath(path: TokenPath): SerializedPathTrie | undefined {
    if (path.length === 0) return this.#pathTrie;

    let pointer: SerializedPathTrie | undefined = this.#pathTrie;
    for (const segment of path) {
      pointer = pointer.get(JSON.stringify(segment));

      if (pointer === undefined) return;
    }

    return pointer;
  }

  #scanCache = new Map();
  #flatten(
    root: SerializedPathTrie,
    { limit }: { limit: number },
  ): TokenPath[] {
    const result: TokenPath[] = [];

    const stack: [TokenSegment[], SerializedPathTrie][] = [[[], root]];
    while (stack.length) {
      const [currentKeyPath, currentSubtrie] = stack.pop() ?? [];

      if (!currentKeyPath || !currentSubtrie) continue;

      for (const [key, value] of currentSubtrie.entries()) {
        if (value.size) {
          stack.push([[...currentKeyPath, JSON.parse(key)], value]);
          continue;
        }

        result.push([...currentKeyPath, JSON.parse(key)]);

        if (result.length === limit) return result;
      }
    }

    return result;
  }
}
