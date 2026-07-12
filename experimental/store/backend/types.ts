type Awaitable<T> = T | Promise<T>;

export type PathSegment = string | number | symbol;
export type Path = PathSegment[];

export type GetterOptions = {
  limit?: number;
};

export interface Backend {
  get(path: Path, options?: GetterOptions): Awaitable<Path[]>;
  add(path: Path): Awaitable<void>;
  delete(path: Path): Awaitable<boolean>;
}
