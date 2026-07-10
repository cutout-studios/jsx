export type PathSegment = string | number | symbol;
export type Path = PathSegment[];

export type GetterOptions = {
  limit?: number;
};

export interface Backend {
  get(path: Path, options: GetterOptions): Path[];
  set(path: Path, value: PathSegment): boolean;
  delete(path: Path): boolean;
}
