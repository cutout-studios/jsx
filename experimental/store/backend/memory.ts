import type { Backend, GetterOptions, Path, PathSegment } from "./types.ts";

type PathTrie = Map<PathSegment, PathTrie>;

export class MemoryBackend implements Backend {
  constructor(paths: Path[]) {
    for (const path of paths) {
      this.add(path);
    }
  }

  get(path: Path, { limit = 1 }: GetterOptions = {}): Path[] {
    const options = { limit };

    const cacheKey = JSON.stringify([options, path]);

    if (this.#flatCache.has(cacheKey)) {
      return this.#flatCache.get(cacheKey);
    }

    const getRoot = this.#resolvePath(path);

    if (!getRoot) return [];

    const result = this.#flatten(getRoot, options);

    this.#flatCache.set(cacheKey, result);

    return result;
  }

  add(path: Path): void {
    this.#flatCache.clear();

    let pointer = this.#pathTrie;
    for (const segment of path) {
      if (!pointer.has(segment)) {
        pointer.set(segment, new Map());
      }

      pointer = pointer.get(segment) as PathTrie;
    }
  }

  delete(path: Path): boolean {
    const [rootPath, terminalValue] = [path.slice(0, -1), path.at(-1)];

    if (!rootPath.length || !terminalValue) return false;

    const deleteRoot = this.#resolvePath(rootPath);

    if (!deleteRoot) return false;

    const deleteResult = deleteRoot.delete(terminalValue);

    if (deleteResult) {
      this.#flatCache.clear();
    }

    return deleteResult;
  }

  #pathTrie: PathTrie = new Map();
  #resolvePath(path: Path): PathTrie | undefined {
    if (path.length === 0) return this.#pathTrie;

    let pointer: PathTrie | undefined = this.#pathTrie;
    for (const segment of path) {
      pointer = pointer.get(segment);

      if (pointer === undefined) return;
    }

    return pointer;
  }

  #flatCache = new Map();
  #flatten(root: PathTrie, { limit }: { limit: number }): Path[] {
    const result: Path[] = [];

    const stack: [PathSegment[], PathTrie][] = [[[], root]];
    while (stack.length) {
      const [currentKeyPath, currentSubtrie] = stack.pop() ?? [];

      if (!currentKeyPath || !currentSubtrie) continue;

      for (const [key, value] of currentSubtrie.entries()) {
        if (value.size) {
          stack.push([[...currentKeyPath, key], value]);
          continue;
        }

        result.push([...currentKeyPath, key]);

        if (result.length === limit) return result;
      }
    }

    return result;
  }
}
