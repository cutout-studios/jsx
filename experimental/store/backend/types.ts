export type PathSegment = string | number | symbol;
export type Path = PathSegment[];

export type GetterOptions = {
  limit?: number;
};

export interface Backend {
  get(path: Path, options: GetterOptions): Path[];
  add(path: Path): void;
  clear(path: Path): void;
  delete(path: Path): boolean;
}
