type Awaitable<T> = T | Promise<T>;

export type PathSegment = string | number | symbol;
export type Path = PathSegment[];

export type ScanOptions = {
  limit?: number;
};

export interface Backend {
  get(path: Path): Awaitable<PathSegment | undefined>;
  scan(
    prefix: Path,
    options?: ScanOptions,
  ): Awaitable<Generator<Awaitable<Path>>>;
  add(path: Path): Awaitable<void>;
  delete(path: Path): Awaitable<boolean>;
}
