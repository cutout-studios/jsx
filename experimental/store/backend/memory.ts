import type { Backend, Path, PathSegment, ScanOptions } from "./types.ts";

type PathTrie = Map<PathSegment, PathTrie>;

export class MemoryBackend implements Backend {
  constructor(paths: Path[]) {
    for (const path of paths) {
      this.add(path);
    }
  }
  get(path: Path): PathSegment | undefined {
    const getRoot = this.#resolvePath(path);

    if (getRoot?.size !== 1) return;

    const [[value, valueTerminal]] = getRoot.entries().toArray();

    if (valueTerminal.size !== 0) return;

    return value;
  }

  scan(prefix: Path, { limit = 1 }: ScanOptions = {}): Generator<Path> {
    const options = { limit };

    const cacheKey = JSON.stringify([options, prefix]);

    if (this.#scanCache.has(cacheKey)) {
      return this.#scanCache.get(cacheKey);
    }

    const scanRoot = this.#resolvePath(prefix);

    if (!scanRoot) return (function* () {})() as Generator<Path>;

    const result = this.#flatten(scanRoot, options);

    this.#scanCache.set(cacheKey, result);

    return (function* () {
      for (const path of result) yield path;
    })();
  }

  add(path: Path): void {
    this.#scanCache.clear();

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
      this.#scanCache.clear();
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

  #scanCache = new Map();
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
